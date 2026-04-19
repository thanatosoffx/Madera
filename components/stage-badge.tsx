import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS_ES, type OrderStatus } from "@/lib/constants";

const STATUS_VARIANT: Record<OrderStatus, "stock" | "custom" | "muted" | "outline"> = {
  Pendiente: "muted",
  Sourcing_Madera: "outline",
  En_Fabricacion: "custom",
  Control_Calidad: "outline",
  Acabado: "outline",
  Listo_Entrega: "stock",
};

export function StageBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABELS_ES[status]}</Badge>
  );
}
