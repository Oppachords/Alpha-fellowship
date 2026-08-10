import { format } from "date-fns";
import { AdminHeader } from "@/components/admin/admin-header";
import { db } from "@/lib/db";

async function getApplications() {
  try {
    return await db.volunteerApplication.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  } catch {
    return null;
  }
}

export default async function AdminVolunteersPage() {
  const applications = await getApplications();

  return (
    <>
      <AdminHeader title="Volunteer Applications" />
      <div className="flex-1 p-6 space-y-3">
        {applications === null ? (
          <div className="rounded-2xl border border-border bg-white p-8 text-center">
            <p className="type-body-sm text-muted-foreground">Database not connected.</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white p-8 text-center">
            <p className="type-body-sm text-muted-foreground">No applications yet.</p>
          </div>
        ) : (
          applications.map((app) => (
            <article key={app.id} className="rounded-2xl border border-border bg-white p-5">
              <div className="flex justify-between gap-4 mb-2">
                <div>
                  <h2 className="font-medium">{app.name}</h2>
                  <p className="text-sm text-muted-foreground">{app.email}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 capitalize">
                  {app.status} · {format(app.createdAt, "d MMM yyyy")}
                </span>
              </div>
              {app.areaOfInterest && (
                <p className="text-sm">
                  <span className="font-medium">Interest:</span> {app.areaOfInterest}
                </p>
              )}
              {app.skills && (
                <p className="text-sm text-muted-foreground mt-1">{app.skills}</p>
              )}
              {app.message && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{app.message}</p>
              )}
            </article>
          ))
        )}
      </div>
    </>
  );
}
