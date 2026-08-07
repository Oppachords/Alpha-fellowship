import { AdminHeader } from "@/components/admin/admin-header";
import { CreateCampaignForm } from "@/components/admin/create-campaign-form";
import { db } from "@/lib/db";

async function getCampaigns() {
  try {
    return await db.campaign.findMany({ orderBy: { createdAt: "desc" } });
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

export default async function AdminCampaignsPage() {
  const campaigns = await getCampaigns();

  return (
    <>
      <AdminHeader title="Campaigns" />
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CreateCampaignForm />
          </div>
          <div className="lg:col-span-2 space-y-3">
            {campaigns === null ? (
              <div className="rounded-2xl border border-border bg-white p-8 text-center">
                <p className="type-body-sm text-muted-foreground">
                  Connect the database to manage campaigns.
                </p>
              </div>
            ) : campaigns.length === 0 ? (
              <div className="rounded-2xl border border-border bg-white p-8 text-center">
                <p className="type-body-sm text-muted-foreground">No campaigns yet.</p>
              </div>
            ) : (
              campaigns.map((campaign) => (
                <article
                  key={campaign.id}
                  className="rounded-2xl border border-border bg-white p-5"
                >
                  <h2 className="font-medium text-foreground mb-1">{campaign.title}</h2>
                  <p className="text-xs text-muted-foreground capitalize mb-2">
                    {campaign.status} · {campaign.isPublished ? "Published" : "Draft"}
                  </p>
                  {campaign.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {campaign.description}
                    </p>
                  )}
                  {campaign.goalAmount && (
                    <p className="text-sm text-foreground">
                      {formatCurrency(Number(campaign.raisedAmount))} raised of{" "}
                      {formatCurrency(Number(campaign.goalAmount))}
                    </p>
                  )}
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
