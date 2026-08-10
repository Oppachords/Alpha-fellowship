import { AdminHeader } from "@/components/admin/admin-header";
import { AdminRecordActions } from "@/components/admin/admin-record-actions";
import { DeleteRecordButton } from "@/components/admin/delete-record-button";
import {
  CreateAnnouncementForm,
  EditAnnouncementForm,
} from "@/components/admin/cms/content-forms";
import { deleteAnnouncementAction } from "@/lib/actions/content-cms";
import { db } from "@/lib/db";

async function getAnnouncements() {
  try {
    return await db.announcement.findMany({
      orderBy: { startDate: "desc" },
      take: 40,
    });
  } catch {
    return null;
  }
}

export default async function AdminAnnouncementsPage() {
  const items = await getAnnouncements();

  return (
    <>
      <AdminHeader title="Announcements" />
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CreateAnnouncementForm />
          </div>
          <div className="lg:col-span-2 space-y-3">
            {items === null ? (
              <div className="rounded-2xl border border-border bg-white p-8 text-center">
                <p className="type-body-sm text-muted-foreground">Database not connected.</p>
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-2xl border border-border bg-white p-8 text-center">
                <p className="type-body-sm text-muted-foreground">No announcements yet.</p>
              </div>
            ) : (
              items.map((item) => (
                <article key={item.id} className="rounded-2xl border border-border bg-white p-5">
                  <div className="flex justify-between gap-4 mb-2">
                    <h2 className="font-medium">{item.title}</h2>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {item.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.content}</p>
                  <AdminRecordActions
                    editForm={<EditAnnouncementForm item={item} />}
                    deleteButton={
                      <DeleteRecordButton id={item.id} action={deleteAnnouncementAction} />
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
