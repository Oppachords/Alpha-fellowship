import { AdminHeader } from "@/components/admin/admin-header";
import { db } from "@/lib/db";
import { formatDistanceToNow } from "date-fns";

async function getPrayerRequests() {
  try {
    return await db.prayerRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  } catch {
    return null;
  }
}

const statusLabels: Record<string, string> = {
  NEW: "New",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In progress",
  FOLLOW_UP: "Follow up",
  RESOLVED: "Resolved",
  ARCHIVED: "Archived",
};

export default async function AdminPrayerPage() {
  const requests = await getPrayerRequests();

  return (
    <>
      <AdminHeader title="Prayer Requests" />
      <div className="flex-1 p-6">
        {requests === null ? (
          <div className="rounded-2xl border border-border bg-white p-8 text-center">
            <p className="type-body text-muted-foreground">
              Connect Supabase to view prayer requests from members.
            </p>
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white p-8 text-center">
            <p className="type-subheading mb-2">No prayer requests yet</p>
            <p className="type-body-sm text-muted-foreground">
              Submissions from the members portal will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-border bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <h2 className="font-medium text-foreground">
                      {item.isAnonymous ? "Anonymous" : item.name}
                    </h2>
                    {!item.isAnonymous && (
                      <p className="text-sm text-muted-foreground">{item.email}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary mb-1 capitalize">
                      {statusLabels[item.status] ?? item.status}
                    </span>
                    <p className="text-xs text-muted-foreground capitalize">
                      {item.category}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {item.request}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
