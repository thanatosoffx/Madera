"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WoodSwatch } from "@/components/wood-swatch";
import { OrderSummary } from "@/components/order-summary";
import { FINISHES, WOODS, type Finish, type Wood } from "@/lib/constants";
import { computePricing } from "@/lib/pricing";
import { computeEstimatedDelivery, computeLeadDays } from "@/lib/delivery";
import { configuratorSchema, type ConfiguratorPayload } from "@/lib/validation";
import type { Product } from "@/lib/types";

type Props = {
  product: Product;
};

export function MaterialConfigurator({ product }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);

  const defaultWood = (product.base_wood_options[0] as Wood) ?? "Roble";

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<ConfiguratorPayload>({
    resolver: zodResolver(configuratorSchema),
    defaultValues: {
      product_id: product.id,
      wood: WOODS.includes(defaultWood) ? defaultWood : "Roble",
      finish: "Natural",
      notes: "",
    },
  });

  const wood = watch("wood");
  const finish = watch("finish");
  const dims = watch("dimensions");

  const pricing = React.useMemo(
    () => computePricing({ base_cents: product.price_cents, wood, finish }),
    [product.price_cents, wood, finish],
  );

  const delivery = React.useMemo(
    () => computeEstimatedDelivery({ wood, finish, dimensions: dims }),
    [wood, finish, dims],
  );

  const leadDays = React.useMemo(
    () => computeLeadDays({ wood, finish, dimensions: dims }),
    [wood, finish, dims],
  );

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flow: "custom",
          product_id: values.product_id,
          wood: values.wood,
          finish: values.finish,
          dimensions: values.dimensions,
          notes: values.notes,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "No se pudo crear el pedido.");
      }
      const { orderId } = await res.json();
      toast.success("Pedido creado. Te llevamos al seguimiento.");
      router.push(`/cuenta/pedidos/${orderId}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error creando el pedido.",
      );
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-10 md:grid-cols-[1.3fr_1fr]">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <section className="space-y-3">
          <Label>Madera</Label>
          <Controller
            name="wood"
            control={control}
            render={({ field }) => (
              <WoodSwatch value={field.value} onChange={field.onChange} />
            )}
          />
        </section>

        <section className="space-y-3">
          <Label htmlFor="finish">Acabado</Label>
          <Controller
            name="finish"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(v) => field.onChange(v as Finish)}
              >
                <SelectTrigger id="finish">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FINISHES.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </section>

        <section className="space-y-3">
          <Label>Dimensiones opcionales (mm)</Label>
          <div className="grid grid-cols-3 gap-3">
            <Controller
              name="dimensions.width"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  placeholder="Ancho"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? undefined : Number(e.target.value),
                    )
                  }
                />
              )}
            />
            <Controller
              name="dimensions.depth"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  placeholder="Fondo"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? undefined : Number(e.target.value),
                    )
                  }
                />
              )}
            />
            <Controller
              name="dimensions.height"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  placeholder="Alto"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? undefined : Number(e.target.value),
                    )
                  }
                />
              )}
            />
          </div>
          {errors.dimensions ? (
            <p className="text-xs text-destructive">
              Revisa las dimensiones introducidas.
            </p>
          ) : null}
        </section>

        <section className="space-y-3">
          <Label htmlFor="notes">Notas para el taller</Label>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <Textarea
                id="notes"
                placeholder="Ej. Redondear esquinas, añadir cajón central..."
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
        </section>

        <Button
          type="submit"
          size="lg"
          variant="walnut"
          disabled={submitting}
          className="w-full md:w-auto"
        >
          {submitting ? "Enviando..." : "Confirmar encargo y abonar depósito"}
        </Button>
      </motion.div>

      <OrderSummary
        pricing={pricing}
        estimatedDelivery={delivery}
        leadDays={leadDays}
      />
    </form>
  );
}
