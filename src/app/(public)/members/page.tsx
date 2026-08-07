import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/public/page-hero";
import {
  MEMBER_LOGIN_PATH,
  MEMBER_REGISTER_PATH,
} from "@/lib/constants/member";

export const metadata: Metadata = {
  title: "Members",
  description:
    "Join the Alpha Fellowship community — register, connect, and grow together.",
};

export default function MembersLandingPage() {
  return (
    <>
      <PageHero
        eyebrow="Our community"
        title="Members"
        description="Join a vibrant fellowship of young people walking in faith, prayer, and growth together."
      />

      <section className="section-padding bg-background">
        <div className="container-wide max-w-3xl text-center">
          <p className="type-eyebrow mb-4">Member portal</p>
          <h2 className="type-heading mb-6">Belong, connect, and grow</h2>
          <p className="type-body-lg text-muted-foreground mb-10">
            Register to become a member of Alpha Fellowship. Once your application
            is reviewed and approved, you&apos;ll be able to sign in to access the
            members portal, update your profile, and stay connected with the
            community.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href={MEMBER_LOGIN_PATH} className="pill-btn-outline inline-flex">
              Sign in
            </Link>
            <Link href={MEMBER_REGISTER_PATH} className="pill-btn-white inline-flex">
              Register
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
