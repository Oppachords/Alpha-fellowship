"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Calendar,
  Heart,
  HandHeart,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { signOutAction } from "@/lib/actions/auth";
import { MEMBER_BASE_PATH } from "@/lib/constants/member";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: MEMBER_BASE_PATH, icon: LayoutDashboard },
  { label: "My Profile", href: `${MEMBER_BASE_PATH}/profile`, icon: User },
  { label: "Gatherings", href: "/services", icon: Calendar, external: true },
  {
    label: "Prayer Requests",
    href: `${MEMBER_BASE_PATH}/prayer`,
    icon: Heart,
  },
  {
    label: "Counselling",
    href: `${MEMBER_BASE_PATH}/counselling`,
    icon: HandHeart,
  },
];

export function MemberSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-white">
      <div className="border-b border-border px-6 py-5">
        <p className="font-serif text-base font-semibold text-foreground">
          Alpha Fellowship
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">Members Portal</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            !item.external &&
            (item.href === MEMBER_BASE_PATH
              ? pathname === MEMBER_BASE_PATH
              : pathname.startsWith(item.href));

          const className = cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            isActive
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          );

          if (item.external) {
            return (
              <Link key={item.label} href={item.href} className={className}>
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
                <ExternalLink className="ml-auto h-3.5 w-3.5" />
              </Link>
            );
          }

          return (
            <Link key={item.label} href={item.href} className={className}>
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border px-3 py-4 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          Back to website
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
