import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/public/page-hero";
import { getPublicGalleries } from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from gatherings, outreach, and life at Alpha Fellowship Uganda.",
};

export default async function GalleryPage() {
  const { galleries } = await getPublicGalleries();

  return (
    <>
      <PageHero
        imageKey="gallery"
        eyebrow="Moments"
        title="Gallery"
        description="Snapshots from our fellowship, outreach, and community life."
      />

      <section className="section-padding bg-background">
        <div className="container-wide">
          {galleries.length === 0 ? (
            <div className="rounded-2xl border border-border bg-white p-10 text-center">
              <p className="type-subheading mb-2">Gallery coming soon</p>
              <p className="type-body-sm text-muted-foreground">
                Photos from our gatherings and outreach will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleries.map((gallery) => (
                <Link
                  key={gallery.id}
                  href={`/gallery/${gallery.slug}`}
                  className="group rounded-2xl border border-border bg-white overflow-hidden hover:border-brand/30 hover:shadow-lg transition-all"
                >
                  <div className="relative aspect-[4/3] bg-muted">
                    {gallery.coverImage ? (
                      <Image
                        src={gallery.coverImage}
                        alt={gallery.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        {gallery.itemCount} photo{gallery.itemCount !== 1 ? "s" : ""}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h2 className="type-subheading text-base mb-1">{gallery.title}</h2>
                    {gallery.description && (
                      <p className="type-body-sm text-muted-foreground line-clamp-2">
                        {gallery.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {gallery.itemCount} image{gallery.itemCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
