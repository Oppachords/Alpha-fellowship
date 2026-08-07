import Link from "next/link";
import { Clock, MapPin, Calendar, ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { churchContent } from "@/lib/content/church-content";

function getNextService() {
  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;

  for (const service of churchContent.services) {
    const [startH, startM] = service.startTime.split(":").map(Number);
    const serviceTime = startH * 60 + startM;

    if (
      service.dayOfWeek > currentDay ||
      (service.dayOfWeek === currentDay && serviceTime > currentTime)
    ) {
      return service;
    }
  }
  return churchContent.services[0];
}

export function ServiceTimesSection() {
  const nextService = getNextService();

  return (
    <section className="relative z-10 -mt-20 md:-mt-24">
      <div className="container-wide">
        <div className="card-elevated overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Next Service — featured */}
            <div className="lg:col-span-4 bg-brand-dark p-8 md:p-10 text-white">
              <p className="eyebrow text-brand-gold mb-4">Next Service</p>
              <h3 className="font-heading text-3xl md:text-4xl font-medium mb-2">
                {nextService.day}
              </h3>
              <p className="text-2xl text-white/90 font-light mb-6">
                {nextService.startTime} – {nextService.endTime}
              </p>
              <div className="flex items-start gap-2 text-white/60 text-sm">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{nextService.venue}</span>
              </div>
              <ButtonLink
                href="/services"
                className="mt-8 rounded-full bg-brand hover:bg-brand/90 text-white text-sm"
              >
                Plan Your Visit
                <ArrowRight className="ml-2 h-4 w-4" />
              </ButtonLink>
            </div>

            {/* All services */}
            <div className="lg:col-span-8 p-8 md:p-10">
              <p className="eyebrow mb-2">Service Times</p>
              <h2 className="font-heading text-2xl md:text-3xl text-brand-dark mb-8">
                Join Us Every Week
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {churchContent.services.map((service) => (
                  <div
                    key={service.day}
                    className="flex gap-4 p-5 rounded-xl bg-brand-warm/60 border border-border/40"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand/10">
                      <Calendar className="h-5 w-5 text-brand" />
                    </div>
                    <div>
                      <p className="font-medium text-brand-dark">{service.day}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                        <Clock className="h-3.5 w-3.5" />
                        {service.startTime} – {service.endTime}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {service.venue}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-muted-foreground text-sm leading-relaxed">
                {churchContent.serviceDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
