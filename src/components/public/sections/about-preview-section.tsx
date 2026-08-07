import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { churchContent } from "@/lib/content/church-content";

export function AboutPreviewSection() {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
            <Image
              src="/images/hero-sanctuary.png"
              alt="Alpha Fellowship worship community"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <p className="font-heading text-white text-2xl md:text-3xl leading-snug">
                &ldquo;A non-denominational fellowship working among young
                people.&rdquo;
              </p>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="eyebrow mb-4">Who We Are</p>
            <h2 className="heading-section text-brand-dark mb-6">
              Welcome to Our Church Community
            </h2>
            <div className="divider-gold mb-8" />
            <p className="text-lead mb-5">{churchContent.story.intro}</p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {churchContent.story.description}
            </p>
            <ButtonLink
              href="/about"
              variant="outline"
              className="rounded-full border-brand/40 text-brand-dark hover:bg-brand-warm px-6"
            >
              Read Our Story
              <ArrowRight className="ml-2 h-4 w-4" />
            </ButtonLink>
          </div>
        </div>

        {/* Mission & Vision cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-20">
          <div className="card-elevated p-8 md:p-10">
            <p className="eyebrow mb-3">Our Mission</p>
            <h3 className="font-heading text-2xl md:text-3xl text-brand-dark leading-snug">
              {churchContent.mission}
            </h3>
          </div>
          <div className="card-elevated p-8 md:p-10 bg-brand-dark text-white">
            <p className="eyebrow text-brand-gold mb-3">Our Vision</p>
            <h3 className="font-heading text-2xl md:text-3xl leading-snug">
              {churchContent.vision}
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}
