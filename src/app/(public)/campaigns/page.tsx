import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/public/page-hero";
import { db } from "@/lib/db";
import { churchContent } from "@/lib/content/church-content";

export const metadata: Metadata = {
  title: "Campaigns",
  description: "Outreach campaigns and charity initiatives at Alpha Fellowship Uganda.",
};

async function getCampaigns() {
  try {
    return await db.campaign.findMany({
      where: { isPublished: true, status: "active" },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return null;
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();
  const { eliteFoundation } = churchContent;

  return (
    <>
      <PageHero
        imageKey="campaigns"
        eyebrow="Make a difference"
        title="Campaigns & Outreach"
        description="Support our charity work, outreach programs, and community initiatives."
      />

      <section className="section-padding bg-background">
        <div className="container-wide max-w-3xl">
          {campaigns === null ? (
            <div className="rounded-2xl border border-border bg-white p-8 text-center mb-8">
              <p className="type-body-sm text-muted-foreground">
                Active campaigns will appear here once the database is connected.
              </p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="rounded-2xl border border-border bg-white p-8 text-center mb-8">
              <p className="type-subheading mb-2">No active campaigns</p>
              <p className="type-body-sm text-muted-foreground">
                Check back soon or visit our give page to support the mission.
              </p>
            </div>
          ) : (
            <div className="space-y-4 mb-10">
              {campaigns.map((campaign) => (
                <article
                  key={campaign.id}
                  className="rounded-2xl border border-border bg-white p-7"
                >
                  <h2 className="type-subheading mb-2">{campaign.title}</h2>
                  {campaign.description && (
                    <p className="type-body-sm text-muted-foreground mb-4">
                      {campaign.description}
                    </p>
                  )}
                  {campaign.goalAmount && (
                    <p className="type-body-sm text-foreground">
                      Goal: {formatCurrency(Number(campaign.goalAmount))}
                      {" · "}
                      Raised: {formatCurrency(Number(campaign.raisedAmount))}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}

          <div className="rounded-2xl border border-border bg-cream p-7 md:p-8">
            <p className="type-eyebrow mb-3">{eliteFoundation.name}</p>
            <h2 className="type-heading text-2xl mb-4">Community outreach</h2>
            <p className="type-body text-muted-foreground mb-4">
              {eliteFoundation.mission}
            </p>
            <ul className="flex flex-wrap gap-2 mb-6">
              {eliteFoundation.focusAreas.map((area) => (
                <li
                  key={area}
                  className="rounded-full border border-border bg-white px-3 py-1 type-body-sm text-foreground"
                >
                  {area}
                </li>
              ))}
            </ul>
            <Link href="/give" className="pill-btn-outline inline-flex">
              Give to the mission
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
