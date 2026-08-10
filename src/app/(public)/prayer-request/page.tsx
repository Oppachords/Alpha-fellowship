import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/public/page-hero";
import { PrayerRequestForm } from "@/components/member/prayer-request-form";

export const metadata: Metadata = {
  title: "Prayer Request",
  description: "Submit a prayer request to the Alpha Fellowship pastoral team.",
};

export default function PrayerRequestPage() {
  return (
    <>
      <PageHero
        imageKey="prayer"
        eyebrow="Pastoral care"
        title="Prayer request"
        description="Share what you'd like us to pray for. Our team is honored to stand with you."
      />

      <section className="section-padding bg-background">
        <div className="container-wide max-w-2xl mx-auto">
          <p className="type-body-sm text-muted-foreground mb-8 text-center">
            <Link href="/get-involved" className="text-primary hover:underline">
              ← Back to get involved
            </Link>
          </p>
          <PrayerRequestForm
            defaults={{
              name: "",
              email: "",
              phone: "",
            }}
          />
        </div>
      </section>
    </>
  );
}
