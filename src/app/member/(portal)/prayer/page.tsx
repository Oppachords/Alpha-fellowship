import { auth } from "@/lib/auth";
import { MemberHeader } from "@/components/member/member-header";
import { PrayerRequestForm } from "@/components/member/prayer-request-form";

export default async function MemberPrayerPage() {
  const session = await auth();

  return (
    <>
      <MemberHeader title="Prayer Requests" />
      <div className="flex-1 p-6">
        <div className="max-w-2xl">
          <p className="type-body-sm text-muted-foreground mb-6">
            Share your prayer needs with our pastoral team. All requests are
            handled with care and confidentiality.
          </p>
          <PrayerRequestForm
            defaults={{
              name: session?.user?.name ?? "",
              email: session?.user?.email ?? "",
              phone: "",
            }}
          />
        </div>
      </div>
    </>
  );
}
