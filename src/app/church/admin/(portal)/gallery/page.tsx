import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminRecordActions } from "@/components/admin/admin-record-actions";
import { DeleteRecordButton } from "@/components/admin/delete-record-button";
import {
  CreateGalleryForm,
  EditGalleryForm,
  AddGalleryItemForm,
} from "@/components/admin/cms/gallery-forms";
import {
  deleteGalleryAction,
  deleteGalleryItemFormAction,
} from "@/lib/actions/content-cms";
import { db } from "@/lib/db";

async function getGalleries() {
  try {
    return await db.gallery.findMany({
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      include: {
        items: {
          orderBy: { sortOrder: "asc" },
          include: { media: true },
          take: 6,
        },
        _count: { select: { items: true } },
      },
    });
  } catch {
    return null;
  }
}

export default async function AdminGalleryPage() {
  const galleries = await getGalleries();

  return (
    <>
      <AdminHeader title="Gallery" />
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CreateGalleryForm />
          </div>
          <div className="lg:col-span-2 space-y-3">
            {galleries === null ? (
              <div className="rounded-2xl border border-border bg-white p-8 text-center">
                <p className="type-body-sm text-muted-foreground">
                  Connect the database to manage galleries.
                </p>
              </div>
            ) : galleries.length === 0 ? (
              <div className="rounded-2xl border border-border bg-white p-8 text-center">
                <p className="type-body-sm text-muted-foreground">No galleries yet.</p>
              </div>
            ) : (
              galleries.map((gallery) => (
                <article
                  key={gallery.id}
                  className="rounded-2xl border border-border bg-white p-5"
                >
                  <div className="flex justify-between gap-4 mb-2">
                    <div>
                      <h2 className="font-medium">{gallery.title}</h2>
                      <p className="text-xs text-muted-foreground">
                        {gallery._count.items} photo{gallery._count.items !== 1 ? "s" : ""} ·{" "}
                        {gallery.isPublished ? "Published" : "Draft"}
                      </p>
                    </div>
                    {gallery.isPublished && (
                      <Link
                        href={`/gallery/${gallery.slug}`}
                        target="_blank"
                        className="text-sm text-primary hover:underline shrink-0"
                      >
                        View
                      </Link>
                    )}
                  </div>
                  {gallery.items.length > 0 && (
                    <div className="flex gap-2 flex-wrap mb-2">
                      {gallery.items.map((item) => (
                        <div key={item.id} className="relative group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.media.url}
                            alt=""
                            className="h-14 w-14 rounded object-cover"
                          />
                          <form action={deleteGalleryItemFormAction} className="absolute -top-1 -right-1">
                            <input type="hidden" name="id" value={item.id} />
                            <button
                              type="submit"
                              className="hidden group-hover:block h-5 w-5 rounded-full bg-destructive text-white text-xs"
                              title="Remove"
                            >
                              ×
                            </button>
                          </form>
                        </div>
                      ))}
                    </div>
                  )}
                  <AddGalleryItemForm galleryId={gallery.id} />
                  <AdminRecordActions
                    editForm={<EditGalleryForm gallery={gallery} />}
                    deleteButton={
                      <DeleteRecordButton id={gallery.id} action={deleteGalleryAction} />
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
