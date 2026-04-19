import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { OrderStatus } from "@/lib/constants";

export async function transitionStatus(
  orderId: string,
  nextStatus: OrderStatus,
  notes?: string,
) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("orders")
    .update({ status: nextStatus })
    .eq("id", orderId);

  if (error) throw error;

  // The DB trigger logs the status change automatically. If the caller
  // provided notes, append an extra log entry with the note.
  if (notes) {
    await supabase.from("manufacturing_logs").insert({
      order_id: orderId,
      status: nextStatus,
      notes,
    });
  }
}
