import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AnimatedSection } from "@/components/public/animated-section";
import { LeadershipProfileCard } from "@/components/public/leadership-profile-card";
import { PageHero } from "@/components/public/page-hero";
import { churchContent } from "@/lib/content/church-content";
import {
  getPublicChurchProfile,
  getPublicLeaders,
  getPublicServiceTeam,
  getPublicTestimonials,
} from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Alpha Fellowship Uganda — a non-denominational fellowship working among young people in Kampala.",
};

export default async function AboutPage() {
  const [profile, { leaders }, { members: serviceTeam }, { testimonials }] =
    await Promise.all([
      getPublicChurchProfile(),
      getPublicLeaders(),
      getPublicServiceTeam(),
      getPublicTestimonials(),
    ]);

  const storyParagraphs = (profile.story ?? churchContent.story.intro).split(/\n\n+/);

  return (
    <>
      <PageHero
        imageKey="about"
        eyebrow="Who we are"
        title="About Alpha Fellowship"
        description={profile.tagline ?? churchContent.tagline}
      />

      <section className="section-padding bg-background">
        <div className="container-content">
          <p className="type-eyebrow mb-4 text-center">Our story</p>
          <h2 className="type-heading text-center mb-8">A fellowship for young people</h2>
          {storyParagraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 40)}
              className="type-body-lg text-muted-foreground text-center mb-6 last:mb-0"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="section-padding bg-cream">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-white p-8 text-center">
              <p className="type-label mb-3">Mission</p>
              <h2 className="type-heading text-balance">
                {profile.mission ?? churchContent.mission}
              </h2>
            </div>
            <div className="rounded-2xl border border-border bg-white p-8 text-center">
              <p className="type-label mb-3">Vision</p>
              <h2 className="type-heading text-balance">
                {profile.vision ?? churchContent.vision}
              </h2>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background section-fade-in">
        <div className="container-wide">
          <AnimatedSection>
            <p className="type-eyebrow mb-4 text-center">Leadership</p>
            <h2 className="type-heading mb-12 text-center">Those who serve</h2>
          </AnimatedSection>
          <div className="mx-auto flex max-w-5xl flex-col gap-8">
            {leaders.map((leader, index) => (
              <LeadershipProfileCard key={leader.id} leader={leader} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-cream section-fade-in">
        <div className="container-wide">
          <AnimatedSection>
            <p className="type-eyebrow mb-4 text-center">Service team</p>
            <h2 className="type-heading mb-4 text-center">Behind the scenes</h2>
            <p className="type-body-sm mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              Dedicated team members who help coordinate gatherings, media, and church
              administration at Alpha Fellowship.
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {serviceTeam.map((member, index) => (
              <AnimatedSection key={member.id} delay={index * 0.08}>
                <div className="h-full rounded-2xl border border-border bg-white p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                {member.photoUrl ? (
                  <div className="relative mx-auto mb-5 h-24 w-24 overflow-hidden rounded-full bg-muted">
                    <Image
                      src={member.photoUrl}
                      alt={member.name ?? member.position}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                ) : (
                  <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full border border-dashed border-border bg-muted/40 text-xs text-muted-foreground">
                    Photo coming soon
                  </div>
                )}
                {member.name && member.name !== member.position && (
                  <h3 className="type-subheading mb-1">{member.name}</h3>
                )}
                <p className="type-label mb-3">{member.position}</p>
                {member.bio && (
                  <p className="type-body-sm text-muted-foreground">{member.bio}</p>
                )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="section-padding bg-cream">
          <div className="container-wide">
            <p className="type-eyebrow mb-4 text-center">Stories</p>
            <h2 className="type-heading text-center mb-12">What people say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((item) => (
                <blockquote
                  key={item.id}
                  className="rounded-2xl border border-border bg-white p-7"
                >
                  <p className="type-body-sm text-muted-foreground mb-4 italic">
                    &ldquo;{item.content}&rdquo;
                  </p>
                  <footer className="type-subheading text-base">{item.name}</footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-primary text-white text-center">
        <div className="container-narrow">
          <h2 className="type-heading-lg mb-4">Come and see</h2>
          <p className="type-body-lg text-white/80 mb-8 max-w-lg mx-auto">
            {churchContent.heroSubtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/services" className="pill-btn-primary inline-flex">
              Plan your visit
            </Link>
            <Link href="/give" className="pill-btn-ghost inline-flex">
              Donate
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
