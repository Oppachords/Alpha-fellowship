import { AdminHeader } from "@/components/admin/admin-header";
import { CreateMinistryForm } from "@/components/admin/create-ministry-form";
import { MinistryImageUpload } from "@/components/admin/ministry-image-upload";
import { db } from "@/lib/db";

async function getMinistries() {
  try {
    return await db.ministry.findMany({ orderBy: { name: "asc" } });
  } catch {
    return null;
  }
}

export default async function AdminMinistriesPage() {
  const ministries = await getMinistries();

  return (
    <>
      <AdminHeader title="Ministries" />
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CreateMinistryForm />
          </div>
          <div className="lg:col-span-2 space-y-3">
            {ministries === null ? (
              <div className="rounded-2xl border border-border bg-white p-8 text-center">
                <p className="type-body-sm text-muted-foreground">
                  Connect the database to manage ministries.
                </p>
              </div>
            ) : ministries.length === 0 ? (
              <div className="rounded-2xl border border-border bg-white p-8 text-center">
                <p className="type-body-sm text-muted-foreground">No ministries yet.</p>
              </div>
            ) : (
              ministries.map((ministry) => (
                <article
                  key={ministry.id}
                  className="rounded-2xl border border-border bg-white p-5"
                >
                  <div className="flex flex-col sm:flex-row gap-5">
                    {ministry.imageUrl ? (
                      <div className="relative h-24 w-full sm:h-20 sm:w-28 shrink-0 overflow-hidden rounded-xl bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={ministry.imageUrl}
                          alt={ministry.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-24 w-full sm:h-20 sm:w-28 shrink-0 items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 text-xs text-muted-foreground">
                        No photo
                      </div>
                    )}
                    <div className="flex-1">
                      <h2 className="font-medium text-foreground mb-1">{ministry.name}</h2>
                      <p className="text-xs text-muted-foreground mb-2">
                        {ministry.isPublished ? "Published" : "Draft"}
                      </p>
                      {ministry.description && (
                        <p className="text-sm text-muted-foreground mb-4">
                          {ministry.description}
                        </p>
                      )}
                      <MinistryImageUpload
                        ministryId={ministry.id}
                        ministryName={ministry.name}
                        currentUrl={ministry.imageUrl}
                      />
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
