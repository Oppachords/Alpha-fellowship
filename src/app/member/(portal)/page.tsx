import Link from "next/link";
import { auth } from "@/lib/auth";
import { MemberHeader } from "@/components/member/member-header";
import { churchContent } from "@/lib/content/church-content";
import { Calendar, User, Heart, ArrowRight } from "lucide-react";

function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  return `${h}:${String(minutes).padStart(2, "0")} ${period}`;
}

export default async function MemberDashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  return (
    <>
      <MemberHeader title="Dashboard" />
      <div className="flex-1 p-6 space-y-8">
        <div className="rounded-2xl border border-border bg-white p-6 md:p-8">
          <p className="type-eyebrow mb-2">Welcome back</p>
          <h2 className="type-heading text-2xl sm:text-3xl mb-2">
            Hello, {firstName}
          </h2>
          <p className="type-body-sm text-muted-foreground">
            {churchContent.tagline}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border bg-white p-5">
            <p className="type-label mb-2">Membership</p>
            <p className="type-subheading text-base">Visitor</p>
            <p className="type-body-sm text-muted-foreground mt-1">
              Status updates when database is connected
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5">
            <p className="type-label mb-2">Member number</p>
            <p className="type-subheading text-base">—</p>
            <p className="type-body-sm text-muted-foreground mt-1">
              Assigned after membership approval
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5">
            <p className="type-label mb-2">Date joined</p>
            <p className="type-subheading text-base">—</p>
            <p className="type-body-sm text-muted-foreground mt-1">
              Recorded on approval
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="type-subheading">Upcoming gatherings</h2>
            </div>
            <div className="space-y-3">
              {churchContent.services.map((service) => (
                <div
                  key={service.day}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {service.day}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {service.venue}
                    </p>
                  </div>
                  <p className="type-meta text-xs">
                    {formatTime(service.startTime)} – {formatTime(service.endTime)}
                  </p>
                </div>
              ))}
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-1 text-sm text-primary mt-4 hover:underline"
            >
              View all gatherings
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="type-subheading mb-4">Quick links</h2>
            <div className="space-y-2">
              <Link
                href="/member/profile"
                className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 text-sm hover:bg-muted transition-colors"
              >
                <User className="h-4 w-4 text-primary" />
                Update my profile
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </Link>
              <div className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 text-sm opacity-60">
                <Heart className="h-4 w-4 text-primary" />
                Submit a prayer request
                <span className="ml-auto text-[10px] uppercase tracking-wide text-muted-foreground">
                  Phase 6
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
