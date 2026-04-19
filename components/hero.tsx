import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsl(var(--accent)/0.18),transparent_60%)]"
      />
      <div className="container grid items-center gap-12 py-24 md:grid-cols-2 md:py-32">
        <div className="space-y-6 animate-fade-in">
          <p className="text-xs uppercase tracking-[0.3em] text-oak">
            Taller · Madera maciza · Desde 1998
          </p>
          <h1 className="text-balance text-4xl font-serif leading-[1.05] md:text-6xl">
            Muebles con alma de <span className="italic text-oak">roble</span>,
            trabajados a mano.
          </h1>
          <p className="max-w-lg text-lg text-muted-foreground">
            Descubre piezas listas para entrega inmediata o encarga un mueble
            hecho a medida, siguiendo su fabricación en tiempo real.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" variant="walnut">
              <Link href="/catalogo">Ver catálogo</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/configurador">Configurar a medida</Link>
            </Button>
          </div>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border/60 bg-gradient-to-br from-oak/30 via-walnut/20 to-walnut/80 shadow-2xl">
          <div
            aria-hidden
            className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 opacity=%220.45%22/></svg>')] mix-blend-overlay"
          />
          <div className="absolute inset-x-6 bottom-6 rounded-md border border-white/10 bg-walnut/70 p-5 backdrop-blur">
            <p className="font-serif text-xl text-bone">
              &ldquo;Cada veta cuenta una historia distinta.&rdquo;
            </p>
            <p className="mt-2 text-xs uppercase tracking-widest text-bone/70">
              Maestro artesano
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
