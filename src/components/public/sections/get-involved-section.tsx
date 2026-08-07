import Link from "next/link";
import {
  Heart,
  HandHeart,
  Users,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";
import { churchContent } from "@/lib/content/church-content";

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

export function GetInvolvedSection() {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="eyebrow mb-4">Take Action</p>
          <h2 className="heading-section text-brand-dark mb-6">
            Get Involved
          </h2>
          <div className="divider-gold mx-auto mb-6" />
          <p className="text-lead">
            There are many ways to connect, serve, and grow with Alpha
            Fellowship. Find your place in our community.
          </p>
        </div>

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
              <h3 className="font-heading text-xl text-brand-dark mb-2">
                {option.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                {option.description}
              </p>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-brand transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LeadershipPreviewSection() {
  const leader = churchContent.leadership[0];
  if (!leader) return null;

  return (
    <section className="section-padding-sm bg-brand-warm/50">
      <div className="container-narrow text-center">
        <p className="eyebrow mb-4">Leadership</p>
        <h2 className="heading-subsection text-brand-dark mb-4">
          {leader.name}
        </h2>
        <p className="text-brand font-medium text-sm mb-6">{leader.position}</p>
        <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          {leader.bio}
        </p>
      </div>
    </section>
  );
}

export function EliteFoundationSection() {
  const { eliteFoundation } = churchContent;

  return (
    <section className="section-padding">
      <div className="container-wide">
        <div className="card-elevated overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-12 lg:p-14">
              <p className="eyebrow mb-4">Community Outreach</p>
              <h2 className="heading-subsection text-brand-dark mb-4">
                {eliteFoundation.name}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Founded {eliteFoundation.founded}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {eliteFoundation.mission}
              </p>
              <p className="text-sm text-muted-foreground italic">
                {eliteFoundation.vision}
              </p>
            </div>
            <div className="bg-brand-dark p-8 md:p-12 lg:p-14 text-white">
              <p className="eyebrow text-brand-gold mb-6">Focus Areas</p>
              <ul className="space-y-4">
                {eliteFoundation.focusAreas.map((area) => (
                  <li
                    key={area}
                    className="flex items-center gap-3 text-white/80"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-gold shrink-0" />
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
