import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/public/page-hero";
import { EliteFoundationSection } from "@/components/public/sections/elite-foundation-section";
import { getEliteFoundationMinistry, getPublicMinistries } from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "Ministries",
  description: "Ministries and areas of service at Alpha Fellowship Uganda.",
};

export default async function MinistriesPage() {
  const [{ ministries }, eliteFoundation] = await Promise.all([
    getPublicMinistries(),
    getEliteFoundationMinistry(),
  ]);

  const otherMinistries = ministries.filter(
    (ministry) => ministry.slug !== "elite-foundation"
  );

  return (
    <>
      <PageHero
        imageKey="ministries"
        eyebrow="How we serve"
        title="Ministries"
        description="Fellowship, outreach, counselling, and service at Alpha Fellowship Uganda."
      />

      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {otherMinistries.map((ministry) => (
              <div
                key={ministry.id}
                className="rounded-2xl border border-border bg-white p-7"
              >
                {ministry.imageUrl ? (
                  <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={ministry.imageUrl}
                      alt={ministry.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="mb-5 flex aspect-[16/10] items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 text-xs text-muted-foreground">
                    Photo coming soon
                  </div>
                )}
                <h2 className="type-subheading mb-3">{ministry.name}</h2>
                {ministry.description && (
                  <p className="type-body-sm text-muted-foreground mb-4 line-clamp-4">
                    {ministry.description}
                  </p>
                )}
                <dl className="space-y-1 type-body-sm text-muted-foreground">
                  {ministry.schedule && (
                    <div>
                      <span className="font-medium text-foreground">Schedule: </span>
                      {ministry.schedule}
                    </div>
                  )}
                  {ministry.location && (
                    <div>
                      <span className="font-medium text-foreground">Location: </span>
                      {ministry.location}
                    </div>
                  )}
                </dl>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/contact" className="pill-btn-outline inline-flex">
              Get involved
            </Link>
          </div>
        </div>
      </section>

      {eliteFoundation && (
        <EliteFoundationSection
          name={eliteFoundation.name}
          schedule={eliteFoundation.schedule}
          description={eliteFoundation.description}
        />
      )}
    </>
  );
}
