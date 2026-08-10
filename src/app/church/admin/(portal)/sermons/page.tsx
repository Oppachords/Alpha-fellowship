import { AdminHeader } from "@/components/admin/admin-header";
import { AdminRecordActions } from "@/components/admin/admin-record-actions";
import { DeleteRecordButton } from "@/components/admin/delete-record-button";
import {
  CreateSermonForm,
  EditSermonForm,
} from "@/components/admin/cms/content-forms";
import { deleteSermonAction } from "@/lib/actions/content-cms";
import { db } from "@/lib/db";

async function getSermons() {
  try {
    return await db.sermon.findMany({
      orderBy: [{ sermonDate: "desc" }, { createdAt: "desc" }],
      take: 40,
    });
  } catch {
    return null;
  }
}

export default async function AdminSermonsPage() {
  const sermons = await getSermons();

  return (
    <>
      <AdminHeader title="Sermons" />
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CreateSermonForm />
          </div>
          <div className="lg:col-span-2 space-y-3">
            {sermons === null ? (
              <div className="rounded-2xl border border-border bg-white p-8 text-center">
                <p className="type-body-sm text-muted-foreground">
                  Connect the database to manage sermons.
                </p>
              </div>
            ) : sermons.length === 0 ? (
              <div className="rounded-2xl border border-border bg-white p-8 text-center">
                <p className="type-body-sm text-muted-foreground">No sermons yet.</p>
              </div>
            ) : (
              sermons.map((sermon) => (
                <article
                  key={sermon.id}
                  className="rounded-2xl border border-border bg-white p-5"
                >
                  <div className="flex justify-between gap-4 mb-2">
                    <h2 className="font-medium">{sermon.title}</h2>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {sermon.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                  {sermon.speaker && (
                    <p className="text-sm text-muted-foreground">{sermon.speaker}</p>
                  )}
                  <AdminRecordActions
                    editForm={<EditSermonForm sermon={sermon} />}
                    deleteButton={
                      <DeleteRecordButton id={sermon.id} action={deleteSermonAction} />
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
