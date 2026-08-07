import Link from "next/link";
import { churchContent } from "@/lib/content/church-content";

function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  return `${h}:${String(minutes).padStart(2, "0")} ${period}`;
}

export function GatheringsSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-wide max-w-3xl">
        <p className="type-eyebrow mb-4 text-center">A rhythm for the week</p>
        <h2 className="type-heading text-center mb-6">Gather with us</h2>
        <p className="type-body-lg text-muted-foreground text-center mb-14 max-w-lg mx-auto">
          {churchContent.serviceDescription}
        </p>

        <div className="space-y-4">
          {churchContent.services.map((service) => (
            <div
              key={service.day}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-7 rounded-2xl border border-border bg-white"
            >
              <div>
                <h3 className="type-subheading mb-1">{service.day}</h3>
                <p className="type-body-sm text-muted-foreground">{service.venue}</p>
              </div>
              <p className="type-meta shrink-0">
                {formatTime(service.startTime)} – {formatTime(service.endTime)}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/services" className="pill-btn-outline inline-flex">
            Plan your visit
          </Link>
        </div>
      </div>
    </section>
  );
}
