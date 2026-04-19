import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatCurrencyEUR } from "@/lib/utils";
import { PRODUCT_TYPE_LABELS } from "@/lib/constants";
import type { Product } from "@/lib/types";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

const FALLBACK_BLUR =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiM4QjczNUIiLz48L3N2Zz4=";

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const isStock = product.type === "stock";
  const outOfStock = isStock && product.stock_quantity === 0;
  const primaryImage = product.images[0];
  const href = isStock
    ? `/catalogo/${product.slug}`
    : `/configurador/${product.slug}`;

  return (
    <Card className="group overflow-hidden border-border/60 transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt ?? product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            placeholder="blur"
            blurDataURL={primaryImage.blurDataURL ?? FALLBACK_BLUR}
            priority={priority}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : null}
        <div className="absolute left-4 top-4">
          <Badge variant={isStock ? "stock" : "custom"}>
            {PRODUCT_TYPE_LABELS[product.type]}
          </Badge>
        </div>
      </div>

      <CardContent className="p-5">
        <h3 className="text-lg font-serif leading-tight">{product.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between px-5 pb-5">
        <span className="font-sans text-lg font-medium tabular-nums">
          {isStock
            ? formatCurrencyEUR(product.price_cents)
            : `desde ${formatCurrencyEUR(product.price_cents)}`}
        </span>
        {outOfStock ? (
          <Button variant="walnut" size="sm" disabled>
            Agotado
          </Button>
        ) : (
          <Button asChild variant="walnut" size="sm">
            <Link href={href}>{isStock ? "Comprar" : "Configurar"}</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
