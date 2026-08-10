import { AdminHeader } from "@/components/admin/admin-header";
import { AdminRecordActions } from "@/components/admin/admin-record-actions";
import { DeleteRecordButton } from "@/components/admin/delete-record-button";
import { CreateFaqForm, EditFaqForm } from "@/components/admin/cms/content-forms";
import { deleteFaqAction } from "@/lib/actions/content-cms";
import { db } from "@/lib/db";

async function getFaqs() {
  try {
    return await db.fAQ.findMany({
      orderBy: [{ sortOrder: "asc" }, { question: "asc" }],
    });
  } catch {
    return null;
  }
}

export default async function AdminFaqPage() {
  const faqs = await getFaqs();

  return (
    <>
      <AdminHeader title="FAQ" />
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CreateFaqForm />
          </div>
          <div className="lg:col-span-2 space-y-3">
            {faqs === null ? (
              <div className="rounded-2xl border border-border bg-white p-8 text-center">
                <p className="type-body-sm text-muted-foreground">Database not connected.</p>
              </div>
            ) : faqs.length === 0 ? (
              <div className="rounded-2xl border border-border bg-white p-8 text-center">
                <p className="type-body-sm text-muted-foreground">No FAQs yet.</p>
              </div>
            ) : (
              faqs.map((faq) => (
                <article key={faq.id} className="rounded-2xl border border-border bg-white p-5">
                  <h2 className="font-medium mb-1">{faq.question}</h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">{faq.answer}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {faq.category ?? "General"} · {faq.isPublished ? "Published" : "Draft"}
                  </p>
                  <AdminRecordActions
                    editForm={<EditFaqForm faq={faq} />}
                    deleteButton={<DeleteRecordButton id={faq.id} action={deleteFaqAction} />}
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
