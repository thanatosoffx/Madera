"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrencyEUR, formatDateES } from "@/lib/utils";
import type { PricingBreakdown } from "@/lib/pricing";

type Props = {
  pricing: PricingBreakdown;
  estimatedDelivery: Date;
  leadDays: number;
};

export function OrderSummary({ pricing, estimatedDelivery, leadDays }: Props) {
  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Resumen del encargo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <Row label="Precio base" value={formatCurrencyEUR(pricing.base_cents)} />
        <Row
          label="Suplemento madera"
          value={`+ ${formatCurrencyEUR(pricing.wood_surcharge_cents)}`}
        />
        <Row
          label="Suplemento acabado"
          value={`+ ${formatCurrencyEUR(pricing.finish_surcharge_cents)}`}
        />
        <Separator />
        <motion.div
          key={pricing.total_cents}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <span className="font-medium">Total</span>
          <span className="font-serif text-2xl tabular-nums">
            {formatCurrencyEUR(pricing.total_cents)}
          </span>
        </motion.div>
        <Row
          label="Depósito (30%)"
          value={formatCurrencyEUR(pricing.deposit_cents)}
          muted
        />
        <Separator />
        <div className="space-y-1 rounded-md bg-muted/60 p-3">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Entrega estimada
          </p>
          <motion.p
            key={estimatedDelivery.toISOString()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-serif text-lg"
          >
            {formatDateES(estimatedDelivery)}
          </motion.p>
          <p className="text-xs text-muted-foreground">
            ≈ {leadDays} días laborables desde la confirmación.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function Row({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between ${muted ? "text-muted-foreground" : ""}`}
    >
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
