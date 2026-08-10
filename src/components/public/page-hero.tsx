import { HeroBackground } from "@/components/public/hero-background";
import { HeroText } from "@/components/public/hero-text";
import { getPageHeroImages, type HeroPageKey } from "@/lib/content/hero-images";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  imageKey?: HeroPageKey;
};

export function PageHero({
  eyebrow,
  title,
  description,
  imageKey = "default",
}: PageHeroProps) {
  const images = getPageHeroImages(imageKey);

  return (
    <section
      data-nav-theme="dark"
      className="relative overflow-hidden pt-32 pb-20 text-white"
    >
      <HeroBackground images={images} variant="compact" intervalMs={8500} />

      <div className="relative site-shell text-center">
        <HeroText>
          <p className="type-eyebrow-hero mb-4">{eyebrow}</p>
          <h1 className="type-heading-lg mb-4 text-balance">{title}</h1>
          {description && (
            <p className="type-body-lg mx-auto max-w-2xl text-white/75">{description}</p>
          )}
        </HeroText>
      </div>
    </section>
  );
}
