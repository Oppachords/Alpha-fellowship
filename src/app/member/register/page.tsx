import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/public/page-hero";
import { MembershipApplicationForm } from "@/components/member/membership-application-form";

export const metadata: Metadata = {
  title: "Join Alpha Fellowship",
  description:
    "Apply to become a member of Alpha Fellowship Uganda — a community for young people in Kampala.",
};

export default function MemberRegisterPage() {
  return (
    <>
      <PageHero
        eyebrow="Join us"
        title="Become a member"
        description="Take the next step in your walk of faith with Alpha Fellowship Uganda."
      />

      <section className="section-padding bg-background">
        <div className="container-wide max-w-xl">
          <MembershipApplicationForm />
          <p className="type-body-sm text-muted-foreground text-center mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
