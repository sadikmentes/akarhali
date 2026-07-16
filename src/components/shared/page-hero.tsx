export function PageHero({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className="border-b bg-muted/30 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {subtitle && (
          <p className="mx-auto mt-3 max-w-2xl text-balance text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
