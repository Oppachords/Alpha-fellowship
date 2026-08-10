import Link from "next/link";
import { HeroBackground } from "@/components/public/hero-background";
import { HeroText } from "@/components/public/hero-text";
import { homeHeroImages } from "@/lib/content/hero-images";

export function HeroSection() {
  return (
    <section
      data-nav-theme="dark"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <HeroBackground
        images={homeHeroImages}
        alt="Alpha Fellowship worship and community"
        variant="fullscreen"
        intervalMs={10000}
      />

      <div className="relative container-narrow max-w-3xl pt-24 pb-16">
        <HeroText>
          <p className="type-eyebrow-hero mb-8">A place to belong</p>
          <h1 className="type-display mb-8 text-balance">
            Worship, pray, and grow together.
          </h1>
          <p className="type-body-lg mx-auto mb-10 max-w-xl text-white/75">
            Alpha Fellowship is a non-denominational community gathered around
            grace — working among young people, where honest questions, shared
            prayer, and a life of faith find room to breathe.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/services" className="pill-btn-white">
              Plan your visit
            </Link>
            <Link href="/about" className="pill-btn-ghost">
              Learn more
            </Link>
          </div>
        </HeroText>
      </div>
    </section>
  );
}
