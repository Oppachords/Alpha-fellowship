import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/public/page-hero";
import { MemberRegistrationForm } from "@/components/member/member-registration-form";
import { MEMBER_LOGIN_PATH } from "@/lib/constants/member";

export const metadata: Metadata = {
  title: "Register",
  description: "Create your Alpha Fellowship member account.",
};

export default function MemberRegisterPage() {
  return (
    <>
      <PageHero
        eyebrow="Join us"
        title="Create your account"
        description="Register as a member of Alpha Fellowship Uganda. Your account will be activated after admin approval."
      />

      <section className="section-padding bg-background">
        <div className="container-wide max-w-xl">
          <MemberRegistrationForm />
          <p className="type-body-sm text-muted-foreground text-center mt-6">
            Already approved?{" "}
            <Link href={MEMBER_LOGIN_PATH} className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
