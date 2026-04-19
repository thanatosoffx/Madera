export const ORDER_STATUSES = [
  "Pendiente",
  "Sourcing_Madera",
  "En_Fabricacion",
  "Control_Calidad",
  "Acabado",
  "Listo_Entrega",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABELS_ES: Record<OrderStatus, string> = {
  Pendiente: "Pendiente",
  Sourcing_Madera: "Abastecimiento de Madera",
  En_Fabricacion: "En Fabricación",
  Control_Calidad: "Control de Calidad",
  Acabado: "Acabado",
  Listo_Entrega: "Listo para Entrega",
};

export const STATUS_DESCRIPTIONS_ES: Record<OrderStatus, string> = {
  Pendiente: "Confirmamos tu pedido y preparamos el taller.",
  Sourcing_Madera: "Seleccionamos las tablas adecuadas en nuestros proveedores.",
  En_Fabricacion: "Cortes, uniones y ensamblaje de la pieza.",
  Control_Calidad: "Revisión de medidas, juntas y estructura.",
  Acabado: "Lijado final, aceites, barnices o lacados.",
  Listo_Entrega: "Tu pieza está lista para enviarse.",
};

export const WOODS = ["Roble", "Nogal", "Pino"] as const;
export type Wood = (typeof WOODS)[number];

export const FINISHES = ["Natural", "Aceite", "Barniz", "Lacado"] as const;
export type Finish = (typeof FINISHES)[number];

export const PRODUCT_TYPE_LABELS = {
  stock: "Entrega Inmediata",
  custom: "Hecho a Medida",
} as const;
