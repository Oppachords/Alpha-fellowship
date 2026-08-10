import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  GraduationCap,
  HeartPulse,
  Target,
  Eye,
  Utensils,
  Users,
} from "lucide-react";
import { AnimatedSection } from "@/components/public/animated-section";
import { EliteFoundationContactDialog } from "@/components/public/elite-foundation-contact-dialog";
import { churchContent } from "@/lib/content/church-content";

const programIcons = {
  "Feed a Family": Utensils,
  "Girls in School": GraduationCap,
  "Youth Skills": Users,
  "Medical Outreach": HeartPulse,
} as const;

type EliteFoundationSectionProps = {
  name?: string;
  schedule?: string | null;
  description?: string | null;
};

export function EliteFoundationSection({
  name = churchContent.eliteFoundation.name,
  schedule,
  description,
}: EliteFoundationSectionProps) {
  const { eliteFoundation } = churchContent;
  const scheduleLine = schedule ?? `Founded ${eliteFoundation.founded}`;
  const storyBody = description ?? eliteFoundation.story;

  return (
    <section className="section-padding bg-cream section-fade-in">
      <div className="site-shell">
        <AnimatedSection className="mx-auto mb-14 max-w-3xl text-center">
          <p className="type-eyebrow mb-4">{eliteFoundation.eyebrow}</p>
          <h2 className="type-heading mb-4">{name}</h2>
          <p className="type-body text-muted-foreground">{eliteFoundation.intro}</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(280px,360px)_1fr] lg:gap-16">
          <AnimatedSection delay={0.1} className="flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[320px] transition-transform duration-500 hover:scale-[1.02]">
              <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-primary/10" />
              <div className="absolute -bottom-5 -left-5 h-24 w-24 rounded-[2rem] bg-sky/10" />
              <div className="relative rounded-[2rem] bg-white p-8 shadow-lg ring-1 ring-border/60">
                <Image
                  src="/images/elite-foundation-logo.png"
                  alt={`${name} logo`}
                  width={280}
                  height={280}
                  className="mx-auto h-auto w-full max-w-[240px] object-contain"
                  priority
                />
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <h3 className="type-subheading mb-3 text-primary">{eliteFoundation.tagline}</h3>
            {scheduleLine && (
              <p className="type-body-sm mb-4 text-muted-foreground">{scheduleLine}</p>
            )}
            <p className="type-body mb-8 text-muted-foreground">{storyBody}</p>

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="h-full rounded-2xl border border-border bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">
                <h4 className="type-label mb-2 flex items-center gap-2 text-primary">
                  <Target className="h-4 w-4" />
                  Mission
                </h4>
                <p className="type-body-sm text-muted-foreground">{eliteFoundation.mission}</p>
              </div>
              <div className="h-full rounded-2xl border border-border bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">
                <h4 className="type-label mb-2 flex items-center gap-2 text-primary">
                  <Eye className="h-4 w-4" />
                  Vision
                </h4>
                <p className="type-body-sm text-muted-foreground">{eliteFoundation.vision}</p>
              </div>
            </div>

            <h4 className="type-subheading mb-4">Our Focus Areas</h4>
            <ul className="mb-8 flex flex-wrap gap-3">
              {eliteFoundation.focusAreas.map((area) => (
                <li
                  key={area}
                  className="rounded-full border border-border bg-white px-4 py-2 type-body-sm text-foreground transition-colors duration-300 hover:border-primary/30 hover:bg-primary/5"
                >
                  {area}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3">
              <EliteFoundationContactDialog />
              <Link
                href={eliteFoundation.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pill-btn-outline inline-flex items-center gap-2 transition-transform duration-300 hover:scale-[1.02]"
              >
                Visit Website
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </AnimatedSection>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {eliteFoundation.programs.map((program, index) => {
            const Icon = programIcons[program.title as keyof typeof programIcons] ?? HeartPulse;
            return (
              <AnimatedSection key={program.title} delay={0.1 + index * 0.08}>
                <div className="flex h-full flex-col rounded-2xl border border-border bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <Icon className="mx-auto mb-4 h-10 w-10 text-primary" />
                  <h5 className="type-subheading mb-2 text-base">{program.title}</h5>
                  <p className="type-body-sm text-muted-foreground">{program.description}</p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        <AnimatedSection delay={0.15} className="mt-14 text-center">
          <h4 className="type-subheading mb-3">{eliteFoundation.partnerCta.title}</h4>
          <p className="type-body-sm mx-auto mb-6 max-w-2xl text-muted-foreground">
            {eliteFoundation.partnerCta.description}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={eliteFoundation.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pill-btn-primary inline-flex transition-transform duration-300 hover:scale-[1.02]"
            >
              Visit Elite Foundation
            </Link>
            <EliteFoundationContactDialog variant="outline" label="Contact Us" />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
