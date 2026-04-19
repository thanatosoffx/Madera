import { CatalogFilterTabs } from "@/components/catalog-filter-tabs";
import { getAllProducts } from "@/lib/db/products";

export const revalidate = 300;

export default async function CatalogPage() {
  const products = await getAllProducts().catch(() => []);
  return (
    <section className="container py-16">
      <header className="mb-8 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-oak">Catálogo</p>
        <h1 className="mt-3 text-4xl font-serif md:text-5xl">
          Piezas en stock y encargos
        </h1>
      </header>
      <CatalogFilterTabs products={products} />
    </section>
  );
}
