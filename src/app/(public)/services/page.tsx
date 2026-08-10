import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/public/page-hero";
import { churchContent } from "@/lib/content/church-content";
import { formatTime } from "@/lib/content/queries";
import { getPublicPrograms, getPublicServices } from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "Gatherings",
  description:
    "Weekly fellowship at Grace Gardens Namungoona — Tuesday 5–8 PM and Sunday 9 AM–12 PM.",
};

export default async function ServicesPage() {
  const [{ services }, { programs }] = await Promise.all([
    getPublicServices(),
    getPublicPrograms(),
  ]);

  return (
    <>
      <PageHero
        imageKey="services"
        eyebrow="A rhythm for the week"
        title="Gather with us"
        description={churchContent.serviceDescription}
      />

      <section className="section-padding bg-background">
        <div className="container-wide max-w-3xl">
          <p className="type-eyebrow mb-4 text-center">Service times</p>
          <h2 className="type-heading text-center mb-12">When we meet</h2>

          <div className="space-y-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-7 rounded-2xl border border-border bg-white"
              >
                <div>
                  <h3 className="type-subheading mb-1">{service.dayLabel}</h3>
                  <p className="type-body-sm text-muted-foreground">{service.venue}</p>
                  {service.duration && (
                    <p className="type-body-sm text-muted-foreground mt-1">
                      Duration: {service.duration}
                    </p>
                  )}
                  {service.description && (
                    <p className="type-body-sm text-muted-foreground mt-2">
                      {service.description}
                    </p>
                  )}
                </div>
                <p className="type-meta shrink-0">
                  {formatTime(service.startTime)}
                  {service.endTime ? ` – ${formatTime(service.endTime)}` : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-cream">
        <div className="container-wide">
          <p className="type-eyebrow mb-4 text-center">What we do</p>
          <h2 className="type-heading text-center mb-12">Programs &amp; ministries</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map((program) => (
              <div
                key={program.id}
                className="rounded-2xl border border-border bg-white p-7"
              >
                <h3 className="type-subheading mb-3">{program.title}</h3>
                <p className="type-body-sm text-muted-foreground">{program.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/ministries" className="pill-btn-outline inline-flex">
              View ministries
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background text-center">
        <div className="container-narrow">
          <h2 className="type-heading mb-4">Your first visit</h2>
          <p className="type-body-lg text-muted-foreground mb-8 max-w-lg mx-auto">
            Come as you are. All are welcome at Grace Gardens Namungoona, Kampala.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/give" className="pill-btn-outline inline-flex">
              Donate
            </Link>
            <Link href="/contact" className="pill-btn-outline inline-flex">
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
