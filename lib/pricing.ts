import type { Finish, Wood } from "./constants";

const WOOD_SURCHARGE_RATIO: Record<Wood, number> = {
  Pino: 0,
  Roble: 0.15,
  Nogal: 0.35,
};

const FINISH_SURCHARGE_CENTS: Record<Finish, number> = {
  Natural: 0,
  Aceite: 8000,
  Barniz: 14000,
  Lacado: 22000,
};

export type PricingInput = {
  base_cents: number;
  wood: Wood;
  finish: Finish;
};

export type PricingBreakdown = {
  base_cents: number;
  wood_surcharge_cents: number;
  finish_surcharge_cents: number;
  total_cents: number;
  deposit_cents: number;
};

const DEPOSIT_RATIO = 0.3;

export function computePricing(input: PricingInput): PricingBreakdown {
  const wood_surcharge_cents = Math.round(
    input.base_cents * WOOD_SURCHARGE_RATIO[input.wood],
  );
  const finish_surcharge_cents = FINISH_SURCHARGE_CENTS[input.finish];
  const total_cents =
    input.base_cents + wood_surcharge_cents + finish_surcharge_cents;
  const deposit_cents = Math.round(total_cents * DEPOSIT_RATIO);
  return {
    base_cents: input.base_cents,
    wood_surcharge_cents,
    finish_surcharge_cents,
    total_cents,
    deposit_cents,
  };
}
