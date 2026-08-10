import { AdminHeader } from "@/components/admin/admin-header";
import { AdminRecordActions } from "@/components/admin/admin-record-actions";
import { DeleteRecordButton } from "@/components/admin/delete-record-button";
import {
  CreateLeaderForm,
  EditLeaderForm,
} from "@/components/admin/cms/leader-forms";
import { deleteLeaderAction } from "@/lib/actions/content-cms";
import { db } from "@/lib/db";

async function getLeaders() {
  try {
    return await db.leader.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  } catch {
    return null;
  }
}

export default async function AdminLeadersPage() {
  const leaders = await getLeaders();

  return (
    <>
      <AdminHeader title="Leaders" />
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CreateLeaderForm />
          </div>
          <div className="lg:col-span-2 space-y-3">
            {leaders === null ? (
              <div className="rounded-2xl border border-border bg-white p-8 text-center">
                <p className="type-body-sm text-muted-foreground">
                  Connect the database to manage leaders.
                </p>
              </div>
            ) : leaders.length === 0 ? (
              <div className="rounded-2xl border border-border bg-white p-8 text-center">
                <p className="type-body-sm text-muted-foreground">No leaders yet.</p>
              </div>
            ) : (
              leaders.map((leader) => (
                <article
                  key={leader.id}
                  className="rounded-2xl border border-border bg-white p-5"
                >
                  <div className="flex justify-between gap-4 mb-2">
                    <div>
                      <h2 className="font-medium">{leader.name}</h2>
                      <p className="text-sm text-muted-foreground">{leader.position}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {leader.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                  {leader.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{leader.bio}</p>
                  )}
                  <AdminRecordActions
                    editForm={<EditLeaderForm leader={leader} />}
                    deleteButton={
                      <DeleteRecordButton id={leader.id} action={deleteLeaderAction} />
                    }
                  />
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
