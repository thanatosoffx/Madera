"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-3xl font-serif">Algo salió mal</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        {error.message || "Ha ocurrido un error inesperado."}
      </p>
      <Button variant="walnut" onClick={reset}>
        Reintentar
      </Button>
    </div>
  );
}
