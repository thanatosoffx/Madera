import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createOrderSchema } from "@/lib/validation";
import { computePricing } from "@/lib/pricing";
import { computeEstimatedDelivery } from "@/lib/delivery";
import type { Wood, Finish } from "@/lib/constants";

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = createOrderSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const payload = parsed.data;

  // Fetch product (RLS allows public read)
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, type, price_cents, stock_quantity")
    .eq("id", payload.product_id)
    .maybeSingle();

  if (productError || !product) {
    return NextResponse.json(
      { error: "Producto no encontrado" },
      { status: 404 },
    );
  }

  if (payload.flow === "stock") {
    if (product.type !== "stock" || product.stock_quantity <= 0) {
      return NextResponse.json(
        { error: "Producto sin stock disponible" },
        { status: 409 },
      );
    }

    const { data, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        product_id: product.id,
        flow: "stock",
        total_cents: product.price_cents,
        deposit_paid_cents: product.price_cents,
      })
      .select("id")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message ?? "No se pudo crear el pedido" },
        { status: 500 },
      );
    }
    return NextResponse.json({ orderId: data.id });
  }

  // Custom flow
  if (product.type !== "custom") {
    return NextResponse.json(
      { error: "Este producto no es configurable" },
      { status: 409 },
    );
  }

  const pricing = computePricing({
    base_cents: product.price_cents,
    wood: payload.wood as Wood,
    finish: payload.finish as Finish,
  });
  const eta = computeEstimatedDelivery({
    wood: payload.wood as Wood,
    finish: payload.finish as Finish,
    dimensions: payload.dimensions,
  });

  const { data, error } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      product_id: product.id,
      flow: "custom",
      wood_type: payload.wood,
      finish: payload.finish,
      custom_specs: {
        dimensions: payload.dimensions ?? null,
        notes: payload.notes ?? null,
      },
      deposit_paid_cents: pricing.deposit_cents,
      total_cents: pricing.total_cents,
      estimated_delivery_date: eta.toISOString().slice(0, 10),
    })
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "No se pudo crear el pedido" },
      { status: 500 },
    );
  }

  return NextResponse.json({ orderId: data.id });
}
