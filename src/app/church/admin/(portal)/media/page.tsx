import { AdminHeader } from "@/components/admin/admin-header";
import { MediaUploadForm } from "@/components/admin/media-upload-form";
import { isCloudinaryConfigured } from "@/lib/integrations/cloudinary";
import { db } from "@/lib/db";

async function getMedia() {
  try {
    return await db.media.findMany({
      orderBy: { createdAt: "desc" },
      take: 24,
    });
  } catch {
    return null;
  }
}

export default async function AdminMediaPage() {
  const media = await getMedia();
  const cloudinaryReady = isCloudinaryConfigured();

  return (
    <>
      <AdminHeader title="Media Library" />
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            {!cloudinaryReady && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Add Cloudinary credentials to Vercel to enable uploads.
              </div>
            )}
            {cloudinaryReady && <MediaUploadForm />}
          </div>

          <div className="lg:col-span-2">
            {media === null ? (
              <div className="rounded-2xl border border-border bg-white p-8 text-center">
                <p className="type-body-sm text-muted-foreground">
                  Connect the database to manage media records.
                </p>
              </div>
            ) : media.length === 0 ? (
              <div className="rounded-2xl border border-border bg-white p-8 text-center">
                <p className="type-body-sm text-muted-foreground">
                  No media uploaded yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {media.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-border bg-white overflow-hidden"
                  >
                    <div className="aspect-square bg-muted relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.url}
                        alt={item.altText ?? item.filename}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-foreground truncate">
                        {item.originalName ?? item.filename}
                      </p>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline truncate block"
                      >
                        Open URL
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
