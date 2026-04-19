import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-oak">Error 404</p>
      <h2 className="text-4xl font-serif">Página no encontrada</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        La pieza que buscas podría estar en el taller. Vuelve al catálogo.
      </p>
      <Button asChild variant="walnut">
        <Link href="/">Volver al inicio</Link>
      </Button>
    </div>
  );
}
