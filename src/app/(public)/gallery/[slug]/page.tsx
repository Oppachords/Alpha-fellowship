import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/public/page-hero";
import { getPublicGalleryBySlug } from "@/lib/content/queries";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { gallery } = await getPublicGalleryBySlug(slug);
  if (!gallery) return { title: "Gallery" };
  return {
    title: gallery.title,
    description: gallery.description ?? `Photos from ${gallery.title}`,
  };
}

export default async function GalleryDetailPage({ params }: Props) {
  const { slug } = await params;
  const { gallery, items } = await getPublicGalleryBySlug(slug);

  if (!gallery) notFound();

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title={gallery.title}
        description={gallery.description ?? undefined}
      />

      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="mb-8">
            <Link href="/gallery" className="text-sm text-primary hover:underline">
              ← All galleries
            </Link>
          </div>

          {items.length === 0 ? (
            <div className="rounded-2xl border border-border bg-white p-10 text-center">
              <p className="type-body-sm text-muted-foreground">
                No photos in this gallery yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <figure
                  key={item.id}
                  className="rounded-xl overflow-hidden border border-border bg-white"
                >
                  <div className="relative aspect-[4/3] bg-muted">
                    <Image
                      src={item.url}
                      alt={item.altText ?? gallery.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  {item.caption && (
                    <figcaption className="p-3 text-sm text-muted-foreground">
                      {item.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
