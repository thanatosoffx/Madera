import Link from "next/link";
import { getAllProducts } from "@/lib/db/products";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";

export const revalidate = 300;

export default async function ConfiguratorIndexPage() {
  const products = await getAllProducts().catch(() => []);
  const custom = products.filter((p) => p.type === "custom");

  return (
    <section className="container py-16">
      <header className="mb-10 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.3em] text-oak">
          Hecho a medida
        </p>
        <h1 className="mt-3 text-4xl font-serif md:text-5xl">
          Elige una pieza para configurar
        </h1>
        <p className="mt-3 text-muted-foreground">
          Personaliza madera, acabado y dimensiones. Te enviamos una estimación
          al instante y, tras el depósito, entras al panel de seguimiento.
        </p>
      </header>
      {custom.length === 0 ? (
        <div className="rounded-md border bg-card p-10 text-center">
          <p className="text-muted-foreground">
            No hay piezas configurables todavía.
          </p>
          <Button asChild variant="walnut" className="mt-4">
            <Link href="/catalogo">Ver catálogo</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {custom.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
