import Link from "next/link";
import {
  Users,
  MessageCircle,
  HandHeart,
  BookOpen,
  Heart,
  ArrowUpRight,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { churchContent } from "@/lib/content/church-content";

const ministryIcons = [Users, MessageCircle, HandHeart, BookOpen, Heart];

export function MinistriesSection() {
  return (
    <section className="section-padding bg-brand-warm/50">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4">What We Do</p>
            <h2 className="heading-section text-brand-dark mb-4">Ministries</h2>
            <div className="divider-gold mb-6" />
            <p className="text-lead">
              Journey your faith with us through fellowship, counselling, and
              community outreach.
            </p>
          </div>
          <ButtonLink
            href="/ministries"
            variant="outline"
            className="rounded-full border-brand/40 shrink-0 self-start md:self-auto"
          >
            View All Ministries
          </ButtonLink>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {churchContent.ministries.map((ministry, index) => {
            const Icon = ministryIcons[index % ministryIcons.length];
            return (
              <Link
                key={ministry.name}
                href="/ministries"
                className="group card-elevated p-7 hover:shadow-[0_8px_50px_-12px_rgba(28,25,23,0.18)] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-brand transition-colors" />
                </div>
                <h3 className="font-heading text-xl text-brand-dark mb-2 group-hover:text-brand transition-colors">
                  {ministry.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {ministry.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
