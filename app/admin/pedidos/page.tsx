import { createSupabaseServerClient } from "@/lib/supabase/server";
import { StageBadge } from "@/components/stage-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ORDER_STATUSES, STATUS_LABELS_ES } from "@/lib/constants";
import { formatCurrencyEUR, formatDateES } from "@/lib/utils";
import type { Order } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  const orders = (data ?? []) as Order[];
  const byStatus = ORDER_STATUSES.map((status) => ({
    status,
    orders: orders.filter((o) => o.status === status),
  }));

  return (
    <section className="container py-12">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-oak">
          Panel del taller
        </p>
        <h1 className="mt-2 text-3xl font-serif">Pipeline de pedidos</h1>
      </header>

      <div className="grid gap-4 lg:grid-cols-6">
        {byStatus.map((col) => (
          <Card key={col.status} className="bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">
                {STATUS_LABELS_ES[col.status]}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {col.orders.length} pedidos
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {col.orders.map((order) => (
                <Card key={order.id} className="p-3">
                  <p className="font-mono text-xs">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-sm">
                    {formatCurrencyEUR(order.total_cents)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateES(order.created_at)}
                  </p>
                  <StageBadge status={order.status} />
                </Card>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
