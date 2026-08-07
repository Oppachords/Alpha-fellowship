import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/public/page-hero";
import { churchContent } from "@/lib/content/church-content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Alpha Fellowship Uganda — a non-denominational fellowship working among young people in Kampala.",
};

export default function AboutPage() {
  const { eliteFoundation } = churchContent;

  return (
    <>
      <PageHero
        eyebrow="Who we are"
        title="About Alpha Fellowship"
        description={churchContent.tagline}
      />

      <section className="section-padding bg-background">
        <div className="container-content">
          <p className="type-eyebrow mb-4 text-center">Our story</p>
          <h2 className="type-heading text-center mb-8">A fellowship for young people</h2>
          <p className="type-body-lg text-muted-foreground text-center mb-6">
            {churchContent.story.intro}
          </p>
          <p className="type-body-lg text-muted-foreground text-center mb-6">
            {churchContent.story.description}
          </p>
          <p className="type-body text-muted-foreground text-center">
            {churchContent.story.extended}
          </p>
        </div>
      </section>

      <section className="section-padding bg-cream">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-white p-8 text-center">
              <p className="type-label mb-3">Mission</p>
              <h2 className="type-heading text-balance">{churchContent.mission}</h2>
            </div>
            <div className="rounded-2xl border border-border bg-white p-8 text-center">
              <p className="type-label mb-3">Vision</p>
              <h2 className="type-heading text-balance">{churchContent.vision}</h2>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-wide">
          <p className="type-eyebrow mb-4 text-center">Leadership</p>
          <h2 className="type-heading text-center mb-12">Those who serve</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {churchContent.leadership.map((leader) => (
              <div
                key={leader.name}
                className="rounded-2xl border border-border bg-white p-7 text-center"
              >
                <h3 className="type-subheading mb-1">{leader.name}</h3>
                <p className="type-label mb-4">{leader.position}</p>
                <p className="type-body-sm text-muted-foreground">{leader.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-cream">
        <div className="container-content">
          <p className="type-eyebrow mb-4 text-center">{eliteFoundation.name}</p>
          <h2 className="type-heading text-center mb-4">Community outreach</h2>
          <p className="type-body-sm text-muted-foreground text-center mb-8">
            Founded {eliteFoundation.founded}
          </p>
          <p className="type-body text-muted-foreground text-center mb-6">
            {eliteFoundation.mission}
          </p>
          <p className="type-body text-muted-foreground text-center mb-10">
            {eliteFoundation.vision}
          </p>
          <ul className="flex flex-wrap justify-center gap-3">
            {eliteFoundation.focusAreas.map((area) => (
              <li
                key={area}
                className="rounded-full border border-border bg-white px-4 py-2 type-body-sm text-foreground"
              >
                {area}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-padding bg-primary text-white text-center">
        <div className="container-narrow">
          <h2 className="type-heading-lg mb-4">Come and see</h2>
          <p className="type-body-lg text-white/80 mb-8 max-w-lg mx-auto">
            {churchContent.heroSubtitle}
          </p>
          <Link href="/services" className="pill-btn-primary inline-flex">
            Plan your visit
          </Link>
        </div>
      </section>
    </>
  );
}
