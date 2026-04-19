import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BuyStockButton } from "@/components/buy-stock-button";
import { getProductBySlug } from "@/lib/db/products";
import { formatCurrencyEUR } from "@/lib/utils";
import { PRODUCT_TYPE_LABELS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug).catch(() => null);
  if (!product) notFound();

  const isStock = product.type === "stock";
  const outOfStock = isStock && product.stock_quantity === 0;
  const primaryImage = product.images[0];

  return (
    <section className="container grid gap-10 py-16 md:grid-cols-2">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt ?? product.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            placeholder="blur"
            blurDataURL={primaryImage.blurDataURL}
            className="object-cover"
          />
        ) : null}
      </div>

      <div className="flex flex-col gap-6">
        <Badge variant={isStock ? "stock" : "custom"} className="w-fit">
          {PRODUCT_TYPE_LABELS[product.type]}
        </Badge>
        <h1 className="text-4xl font-serif md:text-5xl">{product.name}</h1>
        <p className="text-lg text-muted-foreground">{product.description}</p>
        <Separator />
        <div className="flex items-baseline gap-3">
          <span className="font-sans text-3xl tabular-nums">
            {formatCurrencyEUR(product.price_cents)}
          </span>
          {!isStock ? (
            <span className="text-sm text-muted-foreground">precio base</span>
          ) : null}
        </div>

        {isStock ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {outOfStock
                ? "Sin unidades disponibles."
                : `Quedan ${product.stock_quantity} unidades. Envío en 48–72 h.`}
            </p>
            <BuyStockButton productId={product.id} disabled={outOfStock} />
          </div>
        ) : (
          <Button asChild variant="walnut" size="lg">
            <Link href={`/configurador/${product.slug}`}>
              Configurar a medida
            </Link>
          </Button>
        )}

        <div className="mt-8 space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Maderas base:</span>{" "}
            {product.base_wood_options.join(", ") || "Consultar"}
          </p>
          <p>
            Todas las piezas se fabrican en el taller de Artesanía Oak &amp;
            Iron con madera certificada.
          </p>
        </div>
      </div>
    </section>
  );
}
