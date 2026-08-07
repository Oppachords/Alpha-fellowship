import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Image
        src="/images/hero-sanctuary.png"
        alt="Alpha Fellowship worship sanctuary with light streaming through windows"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 hero-overlay" />

      <div className="relative container-narrow max-w-3xl pt-24 pb-16">
        <p className="type-eyebrow-hero mb-8">A place to belong</p>
        <h1 className="type-display mb-8 text-balance">
          Worship, pray, and grow together.
        </h1>
        <p className="type-body-lg text-white/75 mb-10 max-w-xl mx-auto">
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
      </div>
    </section>
  );
}
