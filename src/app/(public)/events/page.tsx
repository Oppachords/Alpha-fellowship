import type { Metadata } from "next";
import { format } from "date-fns";
import Link from "next/link";
import { PageHero } from "@/components/public/page-hero";
import { db } from "@/lib/db";
import { churchContent } from "@/lib/content/church-content";
import { getPublicServices, formatTime } from "@/lib/content/queries";
import { Calendar, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming events and special gatherings at Alpha Fellowship Uganda.",
};

async function getEvents() {
  try {
    return await db.event.findMany({
      where: { isPublished: true, startDate: { gte: new Date() } },
      orderBy: { startDate: "asc" },
      take: 20,
    });
  } catch {
    return null;
  }
}

export default async function EventsPage() {
  const [events, { services }] = await Promise.all([getEvents(), getPublicServices()]);

  return (
    <>
      <PageHero
        eyebrow="What's happening"
        title="Events"
        description="Upcoming gatherings, outreaches, and special meetings at Alpha Fellowship."
      />

      <section className="section-padding bg-background">
        <div className="container-wide max-w-3xl">
          {events === null ? (
            <div className="rounded-2xl border border-border bg-white p-8 text-center mb-8">
              <p className="type-body-sm text-muted-foreground">
                Live events will appear here once the database is connected.
              </p>
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-2xl border border-border bg-white p-8 text-center mb-8">
              <p className="type-subheading mb-2">No upcoming events listed</p>
              <p className="type-body-sm text-muted-foreground mb-4">
                Join us for our regular weekly gatherings in the meantime.
              </p>
              <Link href="/services" className="pill-btn-outline inline-flex">
                View service times
              </Link>
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              {events.map((event) => (
                <article
                  key={event.id}
                  className="rounded-2xl border border-border bg-white p-7"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <h2 className="type-subheading">{event.title}</h2>
                    <div className="flex items-center gap-2 type-meta text-xs">
                      <Calendar className="h-4 w-4" />
                      {format(event.startDate, "EEE, d MMM yyyy")}
                      {event.startTime && ` · ${event.startTime}`}
                    </div>
                  </div>
                  {event.venue && (
                    <p className="type-body-sm text-muted-foreground flex items-center gap-1.5 mb-3">
                      <MapPin className="h-3.5 w-3.5" />
                      {event.venue}
                    </p>
                  )}
                  {event.description && (
                    <p className="type-body-sm text-muted-foreground">{event.description}</p>
                  )}
                  {event.speaker && (
                    <p className="type-body-sm text-muted-foreground mt-2">
                      Speaker: {event.speaker}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}

          <div className="rounded-2xl border border-border bg-cream p-7">
            <p className="type-label mb-2">Weekly rhythm</p>
            <p className="type-body-sm text-muted-foreground mb-4">
              {churchContent.serviceDescription}
            </p>
            <div className="space-y-2 mb-4">
              {services.map((service) => (
                <p key={service.id} className="type-body-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{service.dayLabel}</span>
                  {" · "}
                  {formatTime(service.startTime)}
                  {service.endTime ? ` – ${formatTime(service.endTime)}` : ""}
                  {service.venue ? ` · ${service.venue}` : ""}
                </p>
              ))}
            </div>
            <Link href="/services" className="pill-btn-outline inline-flex">
              Plan your visit
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
