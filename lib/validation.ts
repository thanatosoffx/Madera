import { z } from "zod";
import { FINISHES, WOODS } from "./constants";

export const dimensionsSchema = z.object({
  width: z.number().positive().max(5000),
  depth: z.number().positive().max(5000),
  height: z.number().positive().max(5000),
});

export const configuratorSchema = z.object({
  product_id: z.string().uuid(),
  wood: z.enum(WOODS),
  finish: z.enum(FINISHES),
  dimensions: dimensionsSchema.optional(),
  notes: z.string().max(1000).optional(),
});

export const createOrderStockSchema = z.object({
  flow: z.literal("stock"),
  product_id: z.string().uuid(),
});

export const createOrderCustomSchema = z.object({
  flow: z.literal("custom"),
  product_id: z.string().uuid(),
  wood: z.enum(WOODS),
  finish: z.enum(FINISHES),
  dimensions: dimensionsSchema.optional(),
  notes: z.string().max(1000).optional(),
});

export const createOrderSchema = z.discriminatedUnion("flow", [
  createOrderStockSchema,
  createOrderCustomSchema,
]);

export const statusTransitionSchema = z.object({
  status: z.enum([
    "Pendiente",
    "Sourcing_Madera",
    "En_Fabricacion",
    "Control_Calidad",
    "Acabado",
    "Listo_Entrega",
  ]),
  notes: z.string().max(1000).optional(),
});

export type ConfiguratorPayload = z.infer<typeof configuratorSchema>;
export type CreateOrderPayload = z.infer<typeof createOrderSchema>;
