import { AdminHeader } from "@/components/admin/admin-header";
import { db } from "@/lib/db";
import { ApproveMemberButton } from "@/components/admin/approve-member-button";

async function getPendingMembers() {
  try {
    return await db.user.findMany({
      where: {
        isActive: false,
        roles: { some: { role: { slug: "member" } } },
      },
      include: {
        member: true,
        roles: { include: { role: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return null;
  }
}

export default async function AdminMembersPage() {
  const pendingMembers = await getPendingMembers();

  return (
    <>
      <AdminHeader title="Member Approvals" />
      <div className="flex-1 p-6">
        {pendingMembers === null ? (
          <div className="rounded-2xl border border-border bg-white p-8 text-center">
            <p className="type-body text-muted-foreground">
              Connect your database to review and approve member registrations.
            </p>
          </div>
        ) : pendingMembers.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white p-8 text-center">
            <p className="type-subheading mb-2">No pending registrations</p>
            <p className="type-body-sm text-muted-foreground">
              New member sign-ups awaiting approval will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingMembers.map((user) => (
              <article
                key={user.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-white p-5"
              >
                <div>
                  <h2 className="font-medium text-foreground">{user.name}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  {user.phone && (
                    <p className="text-sm text-muted-foreground">{user.phone}</p>
                  )}
                </div>
                <ApproveMemberButton userId={user.id} />
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
