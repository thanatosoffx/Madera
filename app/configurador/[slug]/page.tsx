import { notFound } from "next/navigation";
import Image from "next/image";
import { MaterialConfigurator } from "@/components/material-configurator";
import { getProductBySlug } from "@/lib/db/products";

export const dynamic = "force-dynamic";

export default async function ConfiguratorPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug).catch(() => null);
  if (!product) notFound();
  if (product.type !== "custom") {
    notFound();
  }

  const image = product.images[0];

  return (
    <section className="container py-16">
      <div className="mb-10 grid items-end gap-6 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-oak">
            Configurador
          </p>
          <h1 className="mt-3 text-4xl font-serif md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-3 max-w-lg text-muted-foreground">
            {product.description}
          </p>
        </div>
        {image ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
            <Image
              src={image.url}
              alt={image.alt ?? product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              placeholder="blur"
              blurDataURL={image.blurDataURL}
              className="object-cover"
            />
          </div>
        ) : null}
      </div>
      <MaterialConfigurator product={product} />
    </section>
  );
}
