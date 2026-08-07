import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { db } from "@/lib/db";
import { churchContent } from "@/lib/content/church-content";
import {
  MessageSquare,
  FileText,
  Calendar,
  Users,
  ArrowRight,
} from "lucide-react";

async function getDashboardStats() {
  try {
    const [unreadMessages, publishedPosts, upcomingEvents, members] =
      await Promise.all([
        db.contactMessage.count({ where: { isRead: false, isArchived: false } }),
        db.blogPost.count({ where: { status: "published" } }),
        db.event.count({
          where: { startDate: { gte: new Date() }, isPublished: true },
        }),
        db.member.count({ where: { status: "ACTIVE" } }),
      ]);

    return { unreadMessages, publishedPosts, upcomingEvents, members, connected: true };
  } catch {
    return {
      unreadMessages: 0,
      publishedPosts: 0,
      upcomingEvents: 0,
      members: 0,
      connected: false,
    };
  }
}

const statCards = [
  {
    key: "unreadMessages",
    label: "Unread messages",
    icon: MessageSquare,
    href: "/admin/messages",
  },
  {
    key: "publishedPosts",
    label: "Published posts",
    icon: FileText,
    href: "/admin/settings",
  },
  {
    key: "upcomingEvents",
    label: "Upcoming events",
    icon: Calendar,
    href: "/admin/settings",
  },
  {
    key: "members",
    label: "Active members",
    icon: Users,
    href: "/admin/settings",
  },
] as const;

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <>
      <AdminHeader title="Dashboard" />
      <div className="flex-1 p-6 space-y-8">
        {!stats.connected && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Database not connected. Set <code className="font-mono">DATABASE_URL</code>{" "}
            in Vercel, run{" "}
            <code className="font-mono">npx prisma migrate deploy</code>, then{" "}
            <code className="font-mono">npm run db:seed</code> to enable live CMS data.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <Link
              key={card.key}
              href={card.href}
              className="rounded-2xl border border-border bg-white p-5 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <card.icon className="h-5 w-5 text-primary" />
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-semibold text-foreground">
                {stats[card.key]}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{card.label}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="type-subheading mb-2">Quick actions</h2>
            <p className="type-body-sm text-muted-foreground mb-4">
              Common admin tasks to get started.
            </p>
            <div className="space-y-2">
              <Link
                href="/admin/settings"
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm hover:bg-muted transition-colors"
              >
                Edit church profile
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link
                href="/admin/messages"
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm hover:bg-muted transition-colors"
              >
                View contact messages
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="type-subheading mb-2">Current mission</h2>
            <p className="type-body text-muted-foreground">{churchContent.mission}</p>
            <p className="type-body-sm text-muted-foreground mt-4">
              Phase 4 CMS is live. Next up: blog posts, events, sermons, and user
              management modules.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
