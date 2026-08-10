import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { churchContent } from "@/lib/content/church-content";

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
  const { eliteFoundation, contact } = churchContent;
  const body =
    description ??
    `${eliteFoundation.mission}\n\n${eliteFoundation.vision}`;
  const scheduleLine =
    schedule ?? `Founded ${eliteFoundation.founded}`;

  return (
    <section className="section-padding bg-cream">
      <div className="site-shell">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(280px,360px)_1fr] gap-10 lg:gap-16 items-center">
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[320px]">
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
          </div>

          <div>
            <p className="type-eyebrow mb-4">Community Outreach</p>
            <h2 className="type-heading mb-2">{name}</h2>
            <p className="type-body-sm text-muted-foreground mb-4">
              {eliteFoundation.subtitle}
            </p>
            {scheduleLine && (
              <p className="type-body-sm text-muted-foreground mb-6">{scheduleLine}</p>
            )}

            {body.split(/\n\n+/).map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="type-body text-muted-foreground mb-4 last:mb-0"
              >
                {paragraph}
              </p>
            ))}

            <ul className="flex flex-wrap gap-3 mt-8 mb-8">
              {eliteFoundation.focusAreas.map((area) => (
                <li
                  key={area}
                  className="rounded-full border border-border bg-white px-4 py-2 type-body-sm text-foreground"
                >
                  {area}
                </li>
              ))}
            </ul>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 type-body-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                <div>
                  <dt className="font-medium text-foreground">Location</dt>
                  <dd>{eliteFoundation.location}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                <div>
                  <dt className="font-medium text-foreground">Phone</dt>
                  <dd>{contact.phone}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:col-span-2">
                <Mail className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                <div>
                  <dt className="font-medium text-foreground">Email</dt>
                  <dd>{contact.email}</dd>
                </div>
              </div>
            </dl>

            <div className="flex flex-wrap gap-3">
              <Link href={eliteFoundation.contactUrl} className="pill-btn-primary inline-flex">
                Contact
              </Link>
              <Link
                href={eliteFoundation.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pill-btn-outline inline-flex items-center gap-2"
              >
                Visit Website
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
