import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Order, OrderWithLogs } from "@/lib/types";

export async function getOrdersForUser(userId: string): Promise<Order[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Order[];
}

export async function getOrderWithLogs(
  orderId: string,
): Promise<OrderWithLogs | null> {
  const supabase = createSupabaseServerClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select(
      "*, product:products(name, slug, images), logs:manufacturing_logs(*)",
    )
    .eq("id", orderId)
    .maybeSingle();

  if (error) throw error;
  if (!order) return null;

  const typed = order as unknown as OrderWithLogs;
  typed.logs = (typed.logs ?? []).sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );
  return typed;
}
