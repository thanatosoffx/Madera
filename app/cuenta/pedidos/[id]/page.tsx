import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { ProductionTimeline } from "@/components/production-timeline";
import { StageBadge } from "@/components/stage-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrderWithLogs } from "@/lib/db/orders";
import { formatCurrencyEUR, formatDateES } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const order = await getOrderWithLogs(params.id);
  if (!order) notFound();

  const image = order.product.images?.[0];

  return (
    <section className="container grid gap-10 py-12 lg:grid-cols-[1fr_380px]">
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-oak">
              Pedido #{order.id.slice(0, 8).toUpperCase()}
            </p>
            <h1 className="mt-2 text-3xl font-serif md:text-4xl">
              {order.product.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              Confirmado el {formatDateES(order.created_at)}
            </p>
          </div>
          <StageBadge status={order.status} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Producción</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductionTimeline
              current={order.status}
              logs={order.logs.map((log) => ({
                status: log.status,
                created_at: log.created_at,
                notes: log.notes,
              }))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historial</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              {order.logs.map((log) => (
                <li key={log.id} className="flex justify-between gap-4">
                  <div>
                    <p className="font-medium">{log.status}</p>
                    {log.notes ? (
                      <p className="text-muted-foreground">{log.notes}</p>
                    ) : null}
                  </div>
                  <p className="text-muted-foreground tabular-nums">
                    {formatDateES(log.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <aside className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Resumen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {image ? (
              <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
                <Image
                  src={image.url}
                  alt={image.alt ?? order.product.name}
                  fill
                  sizes="380px"
                  placeholder="blur"
                  blurDataURL={image.blurDataURL}
                  className="object-cover"
                />
              </div>
            ) : null}
            <Row label="Flujo" value={order.flow} />
            {order.wood_type ? (
              <Row label="Madera" value={order.wood_type} />
            ) : null}
            {order.finish ? (
              <Row label="Acabado" value={order.finish} />
            ) : null}
            <Separator />
            <Row
              label="Total"
              value={formatCurrencyEUR(order.total_cents)}
              emphasized
            />
            <Row
              label="Depósito abonado"
              value={formatCurrencyEUR(order.deposit_paid_cents)}
            />
            {order.estimated_delivery_date ? (
              <Row
                label="Entrega estimada"
                value={formatDateES(order.estimated_delivery_date)}
              />
            ) : null}
          </CardContent>
        </Card>
      </aside>
    </section>
  );
}

function Row({
  label,
  value,
  emphasized,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={emphasized ? "font-serif text-lg" : "tabular-nums"}>
        {value}
      </span>
    </div>
  );
}
