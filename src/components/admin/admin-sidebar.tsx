"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  MessageSquare,
  Users,
  Heart,
  HandHeart,
  Calendar,
  Clock,
  BookOpen,
  Layers,
  Megaphone,
  CreditCard,
  ImageIcon,
  Plug,
  Shield,
  LogOut,
  ExternalLink,
  Newspaper,
} from "lucide-react";
import { signOutAction } from "@/lib/actions/auth";
import { ADMIN_BASE_PATH } from "@/lib/constants/admin";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: ADMIN_BASE_PATH, icon: LayoutDashboard },
  {
    label: "Site Settings",
    href: `${ADMIN_BASE_PATH}/settings`,
    icon: Settings,
  },
  {
    label: "Messages",
    href: `${ADMIN_BASE_PATH}/messages`,
    icon: MessageSquare,
  },
  {
    label: "Members",
    href: `${ADMIN_BASE_PATH}/members`,
    icon: Users,
  },
  {
    label: "Prayer",
    href: `${ADMIN_BASE_PATH}/prayer`,
    icon: Heart,
  },
  {
    label: "Counselling",
    href: `${ADMIN_BASE_PATH}/counselling`,
    icon: HandHeart,
  },
  {
    label: "Events",
    href: `${ADMIN_BASE_PATH}/events`,
    icon: Calendar,
  },
  {
    label: "Gatherings",
    href: `${ADMIN_BASE_PATH}/services`,
    icon: Clock,
  },
  {
    label: "Programs",
    href: `${ADMIN_BASE_PATH}/programs`,
    icon: BookOpen,
  },
  {
    label: "Blog",
    href: `${ADMIN_BASE_PATH}/blog`,
    icon: Newspaper,
  },
  {
    label: "Ministries",
    href: `${ADMIN_BASE_PATH}/ministries`,
    icon: Layers,
  },
  {
    label: "Campaigns",
    href: `${ADMIN_BASE_PATH}/campaigns`,
    icon: Megaphone,
  },
  {
    label: "Payments",
    href: `${ADMIN_BASE_PATH}/payments`,
    icon: CreditCard,
  },
  {
    label: "Media",
    href: `${ADMIN_BASE_PATH}/media`,
    icon: ImageIcon,
  },
  {
    label: "Integrations",
    href: `${ADMIN_BASE_PATH}/integrations`,
    icon: Plug,
  },
  {
    label: "Audit Log",
    href: `${ADMIN_BASE_PATH}/audit`,
    icon: Shield,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-white">
      <div className="border-b border-border px-6 py-5">
        <p className="font-serif text-base font-semibold text-foreground">
          Alpha Fellowship
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">Admin CMS</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            item.href === ADMIN_BASE_PATH
              ? pathname === ADMIN_BASE_PATH
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border px-3 py-4 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          View website
        </Link>
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
