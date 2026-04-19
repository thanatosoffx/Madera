import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrdersForUser } from "@/lib/db/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StageBadge } from "@/components/stage-badge";
import { formatCurrencyEUR, formatDateES } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const orders = await getOrdersForUser(user.id);

  return (
    <section className="container py-16">
      <header className="mb-10 flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-oak">Mi cuenta</p>
        <h1 className="text-4xl font-serif md:text-5xl">Tus pedidos</h1>
        <p className="text-muted-foreground">
          Sigue cada etapa del taller hasta que tu pieza esté lista.
        </p>
      </header>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-muted-foreground">
              Aún no tienes pedidos realizados.
            </p>
            <Button asChild variant="walnut">
              <Link href="/catalogo">Explorar el catálogo</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle>
                    Pedido #{order.id.slice(0, 8).toUpperCase()}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {formatDateES(order.created_at)}
                  </p>
                </div>
                <StageBadge status={order.status} />
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <p>
                    Flujo:{" "}
                    <span className="text-foreground">
                      {order.flow === "stock"
                        ? "Entrega inmediata"
                        : "Hecho a medida"}
                    </span>
                  </p>
                  <p>Total: {formatCurrencyEUR(order.total_cents)}</p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/cuenta/pedidos/${order.id}`}>
                    Ver seguimiento
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
