import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/public/page-hero";
import { VolunteerForm } from "@/components/public/volunteer-form";

export const metadata: Metadata = {
  title: "Volunteer",
  description: "Apply to serve with Alpha Fellowship Uganda.",
};

export default function VolunteerPage() {
  return (
    <>
      <PageHero
        imageKey="involved"
        eyebrow="Serve"
        title="Volunteer with us"
        description="Share your gifts and availability — we'd love to connect you with a team."
      />

      <section className="section-padding bg-background">
        <div className="container-wide max-w-2xl mx-auto">
          <p className="type-body-sm text-muted-foreground mb-8 text-center">
            <Link href="/get-involved" className="text-primary hover:underline">
              ← Back to get involved
            </Link>
          </p>
          <VolunteerForm />
        </div>
      </section>
    </>
  );
}
