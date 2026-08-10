import Image from "next/image";
import { AdminHeader } from "@/components/admin/admin-header";
import { CreateMemberForm } from "@/components/admin/create-member-form";
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <CreateMemberForm />
          </div>
          <div className="lg:col-span-2 rounded-2xl border border-border bg-white p-5">
            <h3 className="font-medium text-foreground mb-2">Approval tips</h3>
            <p className="text-sm text-muted-foreground">
              Review each applicant by name and profile photo when provided.
              Photos are stored securely on Cloudinary and help confirm identity
              before activating accounts.
            </p>
          </div>
        </div>

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
                <div className="flex items-center gap-4">
                  {user.image ? (
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-border">
                      <Image
                        src={user.image}
                        alt={user.name ?? "Member photo"}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                      {(user.name ?? user.email).charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h2 className="font-medium text-foreground">{user.name}</h2>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    {user.phone && (
                      <p className="text-sm text-muted-foreground">{user.phone}</p>
                    )}
                  </div>
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
