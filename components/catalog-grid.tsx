import { ProductCard } from "@/components/product-card";
import { ProductCardSkeleton } from "@/components/product-card-skeleton";
import type { Product } from "@/lib/types";

type Props = {
  products: Product[];
  loading?: boolean;
};

export function CatalogGrid({ products, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, idx) => (
        <ProductCard key={product.id} product={product} priority={idx < 2} />
      ))}
    </div>
  );
}
