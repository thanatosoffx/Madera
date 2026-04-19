import { addDays, isWeekend } from "date-fns";
import type { Finish, Wood } from "./constants";

const BASE_LEAD_DAYS = 21;

const WOOD_COMPLEXITY: Record<Wood, number> = {
  Pino: 0,
  Roble: 7,
  Nogal: 14,
};

const FINISH_COMPLEXITY: Record<Finish, number> = {
  Natural: 0,
  Aceite: 3,
  Barniz: 5,
  Lacado: 8,
};

export type Dimensions = {
  width: number;
  depth: number;
  height: number;
};

function dimensionDays(dims?: Dimensions): number {
  if (!dims) return 0;
  const liters = (dims.width * dims.depth * dims.height) / 1_000_000;
  return Math.max(0, Math.ceil((liters - 200) / 100));
}

function addBusinessDays(from: Date, days: number): Date {
  let remaining = days;
  let cursor = new Date(from.getTime());
  while (remaining > 0) {
    cursor = addDays(cursor, 1);
    if (!isWeekend(cursor)) remaining -= 1;
  }
  return cursor;
}

export type DeliveryInput = {
  wood: Wood;
  finish: Finish;
  dimensions?: Dimensions;
  from?: Date;
};

export function computeEstimatedDelivery(input: DeliveryInput): Date {
  const start = input.from ?? new Date();
  const total =
    BASE_LEAD_DAYS +
    WOOD_COMPLEXITY[input.wood] +
    FINISH_COMPLEXITY[input.finish] +
    dimensionDays(input.dimensions);
  return addBusinessDays(start, total);
}

export function computeLeadDays(input: Omit<DeliveryInput, "from">): number {
  return (
    BASE_LEAD_DAYS +
    WOOD_COMPLEXITY[input.wood] +
    FINISH_COMPLEXITY[input.finish] +
    dimensionDays(input.dimensions)
  );
}
