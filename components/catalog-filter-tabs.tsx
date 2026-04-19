"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/types";

type Props = {
  products: Product[];
};

export function CatalogFilterTabs({ products }: Props) {
  const stock = products.filter((p) => p.type === "stock");
  const custom = products.filter((p) => p.type === "custom");

  return (
    <Tabs defaultValue="todos" className="w-full">
      <TabsList className="mx-auto">
        <TabsTrigger value="todos">Todos</TabsTrigger>
        <TabsTrigger value="stock">Entrega Inmediata</TabsTrigger>
        <TabsTrigger value="custom">Hecho a Medida</TabsTrigger>
      </TabsList>
      <TabsContent value="todos">
        <Grid products={products} />
      </TabsContent>
      <TabsContent value="stock">
        <Grid products={stock} />
      </TabsContent>
      <TabsContent value="custom">
        <Grid products={custom} />
      </TabsContent>
    </Tabs>
  );
}

function Grid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        No hay piezas disponibles en esta categoría.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, idx) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={idx < 2}
        />
      ))}
    </div>
  );
}
