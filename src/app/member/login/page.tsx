import type { Metadata } from "next";
import Link from "next/link";
import { MemberLoginForm } from "@/components/member/member-login-form";
import { MEMBER_REGISTER_PATH } from "@/lib/constants/member";

export const metadata: Metadata = {
  title: "Member Sign In",
  description: "Sign in to the Alpha Fellowship members portal.",
};

export default function MemberLoginPage() {
  return (
    <section className="section-padding bg-cream pt-32">
      <div className="container-wide max-w-md mx-auto">
        <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="font-serif text-lg font-semibold text-foreground"
            >
              Alpha Fellowship
            </Link>
            <p className="type-body-sm text-muted-foreground mt-2">
              Sign in to your member account
            </p>
          </div>
          <MemberLoginForm />
          <p className="type-body-sm text-muted-foreground text-center mt-6">
            Don&apos;t have an account?{" "}
            <Link href={MEMBER_REGISTER_PATH} className="text-primary hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
