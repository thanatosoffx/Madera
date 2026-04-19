export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
        <p className="font-serif text-sm text-muted-foreground">
          Artesanía Oak &amp; Iron — Taller artesanal desde 1998.
        </p>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Hecho a mano en madera maciza.
        </p>
      </div>
    </footer>
  );
}
