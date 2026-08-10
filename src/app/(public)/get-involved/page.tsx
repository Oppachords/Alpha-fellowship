import type { Metadata } from "next";
import Link from "next/link";
import {
  Heart,
  HandHeart,
  Users,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";
import { PageHero } from "@/components/public/page-hero";

export const metadata: Metadata = {
  title: "Get Involved",
  description:
    "Become a member, volunteer, submit a prayer request, or support Alpha Fellowship Uganda.",
};

const involvementOptions = [
  {
    icon: Users,
    title: "Become a Member",
    description:
      "Take the next step in your faith journey and become part of the Alpha Fellowship family.",
    href: "/get-involved/membership",
  },
  {
    icon: HandHeart,
    title: "Volunteer",
    description:
      "Use your gifts and talents to serve the church and community in meaningful ways.",
    href: "/get-involved/volunteer",
  },
  {
    icon: MessageCircle,
    title: "Prayer Request",
    description:
      "Share your prayer needs with us. Our pastoral team is here to pray with and for you.",
    href: "/prayer-request",
  },
  {
    icon: Heart,
    title: "Give & Support",
    description:
      "Support our mission through giving. Your generosity helps us reach more lives for Christ.",
    href: "/give",
  },
];

export default function GetInvolvedPage() {
  return (
    <>
      <PageHero
        eyebrow="Take action"
        title="Get involved"
        description="Connect, serve, and grow with Alpha Fellowship. Find your place in our community."
      />

      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {involvementOptions.map((option) => (
              <Link
                key={option.title}
                href={option.href}
                className="group relative p-7 rounded-2xl border border-border bg-white hover:border-brand/30 hover:shadow-[0_8px_40px_-12px_rgba(28,25,23,0.12)] transition-all duration-300 flex flex-col"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-warm text-brand mb-5 group-hover:bg-brand group-hover:text-white transition-colors">
                  <option.icon className="h-5 w-5" />
                </div>
                <h2 className="font-heading text-xl text-brand-dark mb-2">
                  {option.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                  {option.description}
                </p>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-brand transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
