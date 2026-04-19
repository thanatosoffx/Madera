"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { WOODS, type Wood } from "@/lib/constants";

const WOOD_SWATCHES: Record<Wood, { bg: string; label: string; grain: string }> = {
  Roble: {
    bg: "bg-[#B99A6F]",
    grain: "bg-[repeating-linear-gradient(115deg,#8B735B_0_2px,transparent_2px_6px)]",
    label: "Roble — hardwood balanceado",
  },
  Nogal: {
    bg: "bg-[#5A4030]",
    grain: "bg-[repeating-linear-gradient(115deg,#2D241E_0_2px,transparent_2px_6px)]",
    label: "Nogal — premium, veta profunda",
  },
  Pino: {
    bg: "bg-[#E6C9A0]",
    grain: "bg-[repeating-linear-gradient(115deg,#B8915E_0_2px,transparent_2px_6px)]",
    label: "Pino — ligero y luminoso",
  },
};

type Props = {
  value: Wood;
  onChange: (value: Wood) => void;
};

export function WoodSwatch({ value, onChange }: Props) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(v) => onChange(v as Wood)}
      className="grid grid-cols-3 gap-3"
    >
      {WOODS.map((wood) => {
        const swatch = WOOD_SWATCHES[wood];
        const selected = value === wood;
        return (
          <Label
            key={wood}
            htmlFor={`wood-${wood}`}
            className={cn(
              "group relative flex cursor-pointer flex-col overflow-hidden rounded-md border-2 transition-all",
              selected
                ? "border-oak shadow-md"
                : "border-transparent hover:border-border",
            )}
          >
            <div className={cn("relative h-20 w-full", swatch.bg)}>
              <div
                aria-hidden
                className={cn("absolute inset-0 opacity-60", swatch.grain)}
              />
            </div>
            <div className="flex items-center gap-2 bg-card px-3 py-2">
              <RadioGroupItem id={`wood-${wood}`} value={wood} />
              <span className="text-sm font-medium">{wood}</span>
            </div>
          </Label>
        );
      })}
    </RadioGroup>
  );
}
