import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/public/page-hero";
import { EliteFoundationSection } from "@/components/public/sections/elite-foundation-section";
import { churchContent } from "@/lib/content/church-content";
import {
  getEliteFoundationMinistry,
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
  const [profile, { leaders }, { members: serviceTeam }, eliteFoundation, { testimonials }] =
    await Promise.all([
      getPublicChurchProfile(),
      getPublicLeaders(),
      getPublicServiceTeam(),
      getEliteFoundationMinistry(),
      getPublicTestimonials(),
    ]);

  const storyParagraphs = (profile.story ?? churchContent.story.intro).split(/\n\n+/);

  return (
    <>
      <PageHero
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

      <section className="section-padding bg-background">
        <div className="container-wide">
          <p className="type-eyebrow mb-4 text-center">Leadership</p>
          <h2 className="type-heading text-center mb-12">Those who serve</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leaders.map((leader) => (
              <div
                key={leader.id}
                className="rounded-2xl border border-border bg-white overflow-hidden text-center"
              >
                {leader.photoUrl ? (
                  <div className="relative aspect-[4/5] w-full bg-muted">
                    <Image
                      src={leader.photoUrl}
                      alt={leader.name}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[4/5] w-full items-center justify-center bg-cream text-sm text-muted-foreground">
                    Photo coming soon
                  </div>
                )}
                <div className="p-7">
                  <h3 className="type-subheading mb-1">{leader.name}</h3>
                  <p className="type-label mb-4">{leader.position}</p>
                  {leader.bio && (
                    <p className="type-body-sm text-muted-foreground">{leader.bio}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-cream">
        <div className="container-wide">
          <p className="type-eyebrow mb-4 text-center">Service team</p>
          <h2 className="type-heading text-center mb-4">Behind the scenes</h2>
          <p className="type-body-sm text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Dedicated team members who help coordinate gatherings, media, and church
            administration at Alpha Fellowship.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {serviceTeam.map((member) => (
              <div
                key={member.id}
                className="rounded-2xl border border-border bg-white p-7 text-center"
              >
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

      {eliteFoundation && (
        <EliteFoundationSection
          name={eliteFoundation.name}
          schedule={eliteFoundation.schedule}
          description={eliteFoundation.description}
        />
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
