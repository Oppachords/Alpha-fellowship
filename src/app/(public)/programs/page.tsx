import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/public/page-hero";
import { getPublicPrograms } from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "Programs",
  description: "Programs and activities at Alpha Fellowship Uganda.",
};

export default async function ProgramsPage() {
  const { programs } = await getPublicPrograms();

  return (
    <>
      <PageHero
        imageKey="programs"
        eyebrow="What we do"
        title="Programs"
        description="Weekly programs, outreach, and fellowship activities at Alpha Fellowship."
      />

      <section className="section-padding bg-background">
        <div className="container-wide">
          {programs.length === 0 ? (
            <div className="rounded-2xl border border-border bg-white p-10 text-center">
              <p className="type-body-sm text-muted-foreground">
                Program details will be posted soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {programs.map((program) => (
                <article
                  key={program.id}
                  className="rounded-2xl border border-border bg-white overflow-hidden"
                >
                  {program.imageUrl ? (
                    <div className="relative aspect-[16/10] bg-muted">
                      <Image
                        src={program.imageUrl}
                        alt={program.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[16/10] items-center justify-center border-b border-border bg-muted/40 text-xs text-muted-foreground">
                      Photo coming soon
                    </div>
                  )}
                  <div className="p-7">
                    <h2 className="type-subheading mb-3">{program.title}</h2>
                    {program.description && (
                      <p className="type-body-sm text-muted-foreground mb-4">
                        {program.description}
                      </p>
                    )}
                    <dl className="space-y-1 type-body-sm text-muted-foreground">
                      {program.schedule && (
                        <div>
                          <span className="font-medium text-foreground">Schedule: </span>
                          {program.schedule}
                        </div>
                      )}
                      {program.location && (
                        <div>
                          <span className="font-medium text-foreground">Location: </span>
                          {program.location}
                        </div>
                      )}
                    </dl>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/get-involved" className="pill-btn-outline inline-flex">
              Get involved
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
