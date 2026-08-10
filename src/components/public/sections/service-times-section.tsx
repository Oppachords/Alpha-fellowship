import Link from "next/link";
import { AnimatedSection } from "@/components/public/animated-section";
import { formatTime, type PublicService } from "@/lib/content/format-service";

type ServiceTimesSectionProps = {
  services: PublicService[];
};

export function ServiceTimesSection({ services }: ServiceTimesSectionProps) {
  return (
    <section
      data-nav-theme="light"
      className="section-padding bg-cream section-fade-in"
    >
      <div className="container-wide max-w-3xl">
        <AnimatedSection>
          <p className="type-eyebrow mb-4 text-center">When we meet</p>
          <h2 className="type-heading text-center mb-10">Service times</h2>
        </AnimatedSection>

        <div className="space-y-4">
          {services.map((service, index) => (
            <AnimatedSection key={service.id} delay={index * 0.08}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-7 rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md">
                <div>
                  <h3 className="type-subheading mb-1">{service.dayLabel}</h3>
                  <p className="type-body-sm text-muted-foreground">{service.venue}</p>
                  {service.duration && (
                    <p className="type-body-sm text-muted-foreground mt-1">
                      Duration: {service.duration}
                    </p>
                  )}
                </div>
                <p className="type-meta shrink-0">
                  {formatTime(service.startTime)}
                  {service.endTime ? ` – ${formatTime(service.endTime)}` : ""}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.2}>
          <div className="text-center mt-10">
            <Link href="/services" className="pill-btn-outline inline-flex">
              View all gatherings
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
