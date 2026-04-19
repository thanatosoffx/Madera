import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-xl tracking-tight">
            Artesanía <span className="text-oak">Oak &amp; Iron</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm md:flex">
          <Link
            href="/catalogo"
            className="transition-colors hover:text-oak"
          >
            Catálogo
          </Link>
          <Link
            href="/configurador"
            className="transition-colors hover:text-oak"
          >
            Configurador
          </Link>
          <Link href="/cuenta" className="transition-colors hover:text-oak">
            Mi Cuenta
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="walnut" size="sm" className="hidden md:inline-flex">
            <Link href="/auth/login">Iniciar sesión</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
