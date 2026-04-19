import { Suspense } from "react";
import { Hero } from "@/components/hero";
import { CatalogFilterTabs } from "@/components/catalog-filter-tabs";
import { ProductCardSkeleton } from "@/components/product-card-skeleton";
import { getAllProducts } from "@/lib/db/products";

export const revalidate = 300;

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="container py-20">
        <div className="mb-10 flex flex-col items-center text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-oak">
            Nuestra colección
          </p>
          <h2 className="mt-3 text-3xl font-serif md:text-4xl">
            Catálogo híbrido
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Piezas de stock listas para enviarse y encargos artesanales con
            seguimiento completo del proceso de fabricación.
          </p>
        </div>

        <Suspense fallback={<CatalogSkeleton />}>
          <CatalogSection />
        </Suspense>
      </section>
    </>
  );
}

async function CatalogSection() {
  const products = await safeGetProducts();
  if (products.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        Conecta Supabase y ejecuta <code>supabase/schema.sql</code> +{" "}
        <code>seed.sql</code> para poblar el catálogo.
      </p>
    );
  }
  return <CatalogFilterTabs products={products} />;
}

function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

async function safeGetProducts() {
  try {
    return await getAllProducts();
  } catch {
    // Supabase env not configured yet — render empty state gracefully.
    return [];
  }
}
