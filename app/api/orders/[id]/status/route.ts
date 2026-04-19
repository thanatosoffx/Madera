import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { statusTransitionSchema } from "@/lib/validation";
import { transitionStatus } from "@/lib/db/manufacturing";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Admin claim check.
  const role = (user.app_metadata as { role?: string } | undefined)?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Prohibido" }, { status: 403 });
  }

  const json = await request.json().catch(() => null);
  const parsed = statusTransitionSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    await transitionStatus(params.id, parsed.data.status, parsed.data.notes);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error" },
      { status: 500 },
    );
  }

  revalidatePath(`/cuenta/pedidos/${params.id}`);
  revalidatePath("/admin/pedidos");
  return NextResponse.json({ ok: true });
}
