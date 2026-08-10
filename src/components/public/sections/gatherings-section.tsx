import Link from "next/link";
import { formatTime, type PublicService } from "@/lib/content/format-service";

type GatheringsSectionProps = {
  services: PublicService[];
  serviceDescription: string;
};

export function GatheringsSection({
  services,
  serviceDescription,
}: GatheringsSectionProps) {
  return (
    <section className="section-padding bg-background">
      <div className="container-wide max-w-3xl">
        <p className="type-eyebrow mb-4 text-center">A rhythm for the week</p>
        <h2 className="type-heading text-center mb-6">Gather with us</h2>
        <p className="type-body-lg text-muted-foreground text-center mb-14 max-w-lg mx-auto">
          {serviceDescription}
        </p>

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
              </div>
              <p className="type-meta shrink-0">
                {formatTime(service.startTime)}
                {service.endTime ? ` – ${formatTime(service.endTime)}` : ""}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/services" className="pill-btn-outline inline-flex">
            View all gatherings
          </Link>
        </div>
      </div>
    </section>
  );
}
