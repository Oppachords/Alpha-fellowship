import { format } from "date-fns";
import { AdminHeader } from "@/components/admin/admin-header";
import { CreateEventForm } from "@/components/admin/create-event-form";
import { db } from "@/lib/db";

async function getEvents() {
  try {
    return await db.event.findMany({
      orderBy: { startDate: "desc" },
      take: 30,
    });
  } catch {
    return null;
  }
}

export default async function AdminEventsPage() {
  const events = await getEvents();

  return (
    <>
      <AdminHeader title="Events" />
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CreateEventForm />
          </div>
          <div className="lg:col-span-2 space-y-3">
            {events === null ? (
              <div className="rounded-2xl border border-border bg-white p-8 text-center">
                <p className="type-body-sm text-muted-foreground">
                  Connect the database to manage events.
                </p>
              </div>
            ) : events.length === 0 ? (
              <div className="rounded-2xl border border-border bg-white p-8 text-center">
                <p className="type-body-sm text-muted-foreground">No events yet.</p>
              </div>
            ) : (
              events.map((event) => (
                <article
                  key={event.id}
                  className="rounded-2xl border border-border bg-white p-5"
                >
                  <div className="flex justify-between gap-4 mb-2">
                    <h2 className="font-medium text-foreground">{event.title}</h2>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {format(event.startDate, "d MMM yyyy")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground capitalize mb-2">
                    {event.status} · {event.isPublished ? "Published" : "Draft"}
                  </p>
                  {event.description && (
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  )}
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
