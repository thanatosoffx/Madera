"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn, formatDateTimeES } from "@/lib/utils";
import {
  ORDER_STATUSES,
  STATUS_DESCRIPTIONS_ES,
  STATUS_LABELS_ES,
  type OrderStatus,
} from "@/lib/constants";

export type TimelineEntry = {
  status: OrderStatus;
  created_at: string;
  notes?: string | null;
};

type Props = {
  current: OrderStatus;
  logs: TimelineEntry[];
  orientation?: "horizontal" | "vertical";
};

type StageState = "completed" | "active" | "upcoming";

function resolveState(index: number, currentIndex: number): StageState {
  if (index < currentIndex) return "completed";
  if (index === currentIndex) return "active";
  return "upcoming";
}

export function ProductionTimeline({
  current,
  logs,
  orientation = "horizontal",
}: Props) {
  const currentIndex = ORDER_STATUSES.indexOf(current);

  // Keep the latest log timestamp per status.
  const timestampByStatus = React.useMemo(() => {
    const map = new Map<OrderStatus, string>();
    for (const log of logs) {
      const existing = map.get(log.status);
      if (!existing || new Date(log.created_at) > new Date(existing)) {
        map.set(log.status, log.created_at);
      }
    }
    return map;
  }, [logs]);

  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={cn(
        "relative",
        isHorizontal
          ? "flex flex-col md:flex-row md:items-start md:gap-0"
          : "flex flex-col gap-6",
      )}
    >
      {ORDER_STATUSES.map((status, idx) => {
        const state = resolveState(idx, currentIndex);
        const timestamp = timestampByStatus.get(status);
        const isLast = idx === ORDER_STATUSES.length - 1;

        return (
          <div
            key={status}
            className={cn(
              "relative flex",
              isHorizontal
                ? "flex-1 flex-col md:items-center md:text-center"
                : "flex-row items-start gap-4",
            )}
          >
            <div
              className={cn(
                "relative flex items-center",
                isHorizontal ? "md:flex-col" : "flex-col",
              )}
            >
              <motion.div
                initial={false}
                animate={{
                  scale: state === "active" ? 1.15 : 1,
                  backgroundColor:
                    state === "completed"
                      ? "hsl(var(--accent))"
                      : state === "active"
                        ? "hsl(var(--primary))"
                        : "hsl(var(--muted))",
                }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className={cn(
                  "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2",
                  state === "active"
                    ? "border-primary"
                    : state === "completed"
                      ? "border-accent"
                      : "border-border",
                )}
                aria-label={STATUS_LABELS_ES[status]}
              >
                {state === "completed" ? (
                  <Check className="h-5 w-5 text-accent-foreground" />
                ) : (
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      state === "active"
                        ? "text-primary-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {idx + 1}
                  </span>
                )}
              </motion.div>

              {!isLast ? (
                <div
                  className={cn(
                    "bg-border",
                    isHorizontal
                      ? "hidden md:block md:absolute md:left-1/2 md:top-5 md:h-0.5 md:w-full md:origin-left"
                      : "ml-5 mt-1 h-10 w-0.5 origin-top",
                  )}
                  aria-hidden
                >
                  <motion.div
                    initial={false}
                    animate={{
                      scaleX: isHorizontal && state === "completed" ? 1 : 0,
                      scaleY: !isHorizontal && state === "completed" ? 1 : 0,
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full w-full bg-accent"
                    style={{
                      transformOrigin: isHorizontal ? "left" : "top",
                    }}
                  />
                </div>
              ) : null}
            </div>

            <div
              className={cn(
                "mt-4 min-w-0",
                isHorizontal ? "md:mt-4 md:px-2" : "flex-1",
              )}
            >
              <p
                className={cn(
                  "font-serif text-sm leading-tight md:text-base",
                  state === "upcoming" && "text-muted-foreground",
                )}
              >
                {STATUS_LABELS_ES[status]}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {STATUS_DESCRIPTIONS_ES[status]}
              </p>
              {timestamp ? (
                <p className="mt-1 text-[10px] uppercase tracking-widest text-oak">
                  {formatDateTimeES(timestamp)}
                </p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
