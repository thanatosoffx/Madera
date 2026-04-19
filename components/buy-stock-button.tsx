"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Props = {
  productId: string;
  disabled?: boolean;
};

export function BuyStockButton({ productId, disabled }: Props) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flow: "stock", product_id: productId }),
      });
      if (res.status === 401) {
        toast.error("Inicia sesión para comprar.");
        router.push("/auth/login");
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "No se pudo crear el pedido");
      }
      const { orderId } = await res.json();
      toast.success("Pedido confirmado");
      router.push(`/cuenta/pedidos/${orderId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="walnut"
      size="lg"
      disabled={disabled || loading}
      onClick={handleClick}
    >
      {loading ? "Procesando..." : "Comprar ahora"}
    </Button>
  );
}
