import type { Metadata } from "next";
import Link from "next/link";
import { Smartphone, Building2 } from "lucide-react";
import { PageHero } from "@/components/public/page-hero";
import { churchContent } from "@/lib/content/church-content";

export const metadata: Metadata = {
  title: "Give",
  description:
    "Support Alpha Fellowship Uganda through MTN Mobile Money, Airtel Money, or bank transfer.",
};

export default function GivePage() {
  const { payments } = churchContent;

  return (
    <>
      <PageHero
        eyebrow="Support the mission"
        title="Give generously"
        description="Your giving helps us reach young people, support outreach, and spread the Gospel across Uganda."
      />

      <section className="section-padding bg-background">
        <div className="container-wide max-w-3xl">
          <p className="type-eyebrow mb-4 text-center">Ways to give</p>
          <h2 className="type-heading text-center mb-12">Payment methods</h2>

          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-white p-7">
              <div className="flex items-center gap-3 mb-4">
                <Smartphone className="h-5 w-5 text-primary" />
                <h3 className="type-subheading">MTN Mobile Money</h3>
              </div>
              <dl className="space-y-2 type-body-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Number</dt>
                  <dd className="font-medium text-foreground">{payments.mtn.number}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Merchant code</dt>
                  <dd className="font-medium text-foreground">{payments.mtn.merchantCode}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-border bg-white p-7">
              <div className="flex items-center gap-3 mb-4">
                <Smartphone className="h-5 w-5 text-primary" />
                <h3 className="type-subheading">Airtel Money</h3>
              </div>
              <dl className="space-y-2 type-body-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Number</dt>
                  <dd className="font-medium text-foreground">{payments.airtel.number}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Merchant code</dt>
                  <dd className="font-medium text-foreground">{payments.airtel.merchantCode}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-border bg-white p-7">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="h-5 w-5 text-primary" />
                <h3 className="type-subheading">Bank transfer</h3>
              </div>
              <dl className="space-y-2 type-body-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Account name</dt>
                  <dd className="font-medium text-foreground">{payments.bank.accountName}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Account number</dt>
                  <dd className="font-medium text-foreground">{payments.bank.accountNumber}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Bank</dt>
                  <dd className="font-medium text-foreground">{payments.bank.bank}</dd>
                </div>
              </dl>
            </div>
          </div>

          <p className="type-body-sm text-muted-foreground text-center mt-8">
            Payment details are sourced from alphafellowshipug.com. Administrators can
            update these through the CMS in a future release.
          </p>
        </div>
      </section>

      <section className="section-padding bg-cream text-center">
        <div className="container-narrow">
          <h2 className="type-heading mb-4">Questions about giving?</h2>
          <p className="type-body-lg text-muted-foreground mb-8 max-w-lg mx-auto">
            Reach out and we&apos;ll gladly help you with any questions about donations
            or supporting our outreach work.
          </p>
          <Link href="/contact" className="pill-btn-outline inline-flex">
            Contact us
          </Link>
        </div>
      </section>
    </>
  );
}
