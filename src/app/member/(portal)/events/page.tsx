import { format } from "date-fns";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { MemberHeader } from "@/components/member/member-header";
import { EventRegisterButton } from "@/components/member/event-register-button";
import { db } from "@/lib/db";
import { Calendar } from "lucide-react";

async function getEvents() {
  try {
    return await db.event.findMany({
      where: {
        isPublished: true,
        startDate: { gte: new Date() },
        registrationEnabled: true,
      },
      orderBy: { startDate: "asc" },
    });
  } catch {
    return null;
  }
}

export default async function MemberEventsPage() {
  const session = await auth();
  const events = await getEvents();

  const defaults = {
    name: session?.user?.name ?? "",
    email: session?.user?.email ?? "",
    phone: "",
  };

  return (
    <>
      <MemberHeader title="Events" />
      <div className="flex-1 p-6">
        <div className="max-w-2xl">
          <p className="type-body-sm text-muted-foreground mb-6">
            Register for upcoming events and special gatherings.
          </p>

          {events === null ? (
            <div className="rounded-2xl border border-border bg-white p-8 text-center">
              <p className="type-body-sm text-muted-foreground">
                Event registration will be available once Supabase is connected.
              </p>
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-2xl border border-border bg-white p-8 text-center">
              <p className="type-subheading mb-2">No registrable events</p>
              <p className="type-body-sm text-muted-foreground mb-4">
                Browse public events or join our weekly gatherings.
              </p>
              <Link href="/events" className="pill-btn-outline inline-flex">
                View events
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <article
                  key={event.id}
                  className="rounded-2xl border border-border bg-white p-6"
                >
                  <h2 className="type-subheading mb-2">{event.title}</h2>
                  <p className="type-body-sm text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {format(event.startDate, "EEE, d MMM yyyy")}
                    {event.venue && ` · ${event.venue}`}
                  </p>
                  {event.description && (
                    <p className="type-body-sm text-muted-foreground mt-2">
                      {event.description}
                    </p>
                  )}
                  <EventRegisterButton
                    eventId={event.id}
                    eventTitle={event.title}
                    defaults={defaults}
                  />
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
