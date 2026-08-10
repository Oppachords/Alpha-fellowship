type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="relative bg-sky-deep pt-32 pb-20">
      <div className="absolute inset-0 section-glow opacity-40" />
      <div className="relative site-shell text-center">
        <p className="type-eyebrow-hero mb-4">{eyebrow}</p>
        <h1 className="type-heading-lg mb-4 text-balance">{title}</h1>
        {description && (
          <p className="type-body-lg text-white/75 max-w-2xl mx-auto">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
