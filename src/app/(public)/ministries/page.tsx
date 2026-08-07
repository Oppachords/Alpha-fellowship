import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/public/page-hero";
import { db } from "@/lib/db";
import { churchContent } from "@/lib/content/church-content";

export const metadata: Metadata = {
  title: "Ministries",
  description: "Ministries and programs at Alpha Fellowship Uganda.",
};

async function getMinistries() {
  try {
    return await db.ministry.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    return null;
  }
}

export default async function MinistriesPage() {
  const ministries = await getMinistries();
  const fallbackPrograms = churchContent.programs;

  return (
    <>
      <PageHero
        eyebrow="How we serve"
        title="Ministries"
        description="Areas of fellowship, outreach, and service at Alpha Fellowship Uganda."
      />

      <section className="section-padding bg-background">
        <div className="container-wide">
          {ministries === null || ministries.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fallbackPrograms.map((program) => (
                <div
                  key={program.title}
                  className="rounded-2xl border border-border bg-white p-7"
                >
                  <h2 className="type-subheading mb-3">{program.title}</h2>
                  <p className="type-body-sm text-muted-foreground">{program.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ministries.map((ministry) => (
                <div
                  key={ministry.id}
                  className="rounded-2xl border border-border bg-white p-7"
                >
                  <h2 className="type-subheading mb-3">{ministry.name}</h2>
                  {ministry.description && (
                    <p className="type-body-sm text-muted-foreground mb-4">
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
          )}

          <div className="text-center mt-12">
            <Link href="/contact" className="pill-btn-outline inline-flex">
              Get involved
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
