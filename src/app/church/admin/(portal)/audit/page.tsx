import { formatDistanceToNow } from "date-fns";
import { AdminHeader } from "@/components/admin/admin-header";
import { db } from "@/lib/db";

async function getAuditLogs() {
  try {
    return await db.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });
  } catch {
    return null;
  }
}

export default async function AdminAuditPage() {
  const logs = await getAuditLogs();

  return (
    <>
      <AdminHeader title="Audit Log" />
      <div className="flex-1 p-6">
        <p className="type-body-sm text-muted-foreground mb-6 max-w-2xl">
          Records of sensitive admin actions such as member approvals, content
          changes, payment verification, and media uploads.
        </p>

        {logs === null ? (
          <div className="rounded-2xl border border-border bg-white p-8 text-center">
            <p className="type-body-sm text-muted-foreground">
              Connect Supabase to view audit logs.
            </p>
          </div>
        ) : logs.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white p-8 text-center">
            <p className="type-body-sm text-muted-foreground">
              No audit entries yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((entry) => (
              <article
                key={entry.id}
                className="rounded-2xl border border-border bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="font-medium text-foreground capitalize">
                      {entry.action} · {entry.resource.replace(/_/g, " ")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {entry.user?.name ?? entry.user?.email ?? "System"}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(entry.createdAt, { addSuffix: true })}
                  </p>
                </div>
                <dl className="text-sm text-muted-foreground space-y-1">
                  {entry.resourceId && (
                    <div>
                      <span className="font-medium text-foreground">Resource ID: </span>
                      {entry.resourceId}
                    </div>
                  )}
                  {entry.ipAddress && (
                    <div>
                      <span className="font-medium text-foreground">IP: </span>
                      {entry.ipAddress}
                    </div>
                  )}
                </dl>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
