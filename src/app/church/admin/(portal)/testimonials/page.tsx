import { AdminHeader } from "@/components/admin/admin-header";
import { AdminRecordActions } from "@/components/admin/admin-record-actions";
import { DeleteRecordButton } from "@/components/admin/delete-record-button";
import {
  CreateTestimonialForm,
  EditTestimonialForm,
} from "@/components/admin/cms/content-forms";
import { deleteTestimonialAction } from "@/lib/actions/content-cms";
import { db } from "@/lib/db";

export default async function AdminTestimonialsPage() {
  let items = null;
  try {
    items = await db.testimonial.findMany({ orderBy: { createdAt: "desc" }, take: 40 });
  } catch {
    items = null;
  }

  return (
    <>
      <AdminHeader title="Testimonials" />
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CreateTestimonialForm />
          </div>
          <div className="lg:col-span-2 space-y-3">
            {items === null ? (
              <div className="rounded-2xl border border-border bg-white p-8 text-center">
                <p className="type-body-sm text-muted-foreground">Database not connected.</p>
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-2xl border border-border bg-white p-8 text-center">
                <p className="type-body-sm text-muted-foreground">No testimonials yet.</p>
              </div>
            ) : (
              items.map((item) => (
                <article key={item.id} className="rounded-2xl border border-border bg-white p-5">
                  <h2 className="font-medium mb-1">{item.name}</h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.content}</p>
                  <AdminRecordActions
                    editForm={<EditTestimonialForm item={item} />}
                    deleteButton={
                      <DeleteRecordButton id={item.id} action={deleteTestimonialAction} />
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
