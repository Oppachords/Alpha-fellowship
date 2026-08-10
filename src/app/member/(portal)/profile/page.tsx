import { auth } from "@/lib/auth";
import { MemberHeader } from "@/components/member/member-header";
import { MemberProfileForm } from "@/components/member/member-profile-form";
import { db } from "@/lib/db";

async function getMemberProfile(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { member: true },
    });
    return user;
  } catch {
    return null;
  }
}

export default async function MemberProfilePage() {
  const session = await auth();
  const user = session?.user?.id
    ? await getMemberProfile(session.user.id)
    : null;

  const profile = {
    name: user?.name ?? session?.user?.name ?? "",
    email: user?.email ?? session?.user?.email ?? "",
    phone: user?.phone ?? "",
    address: user?.member?.address ?? "",
    emergencyContact: user?.member?.emergencyContact ?? "",
    emergencyPhone: user?.member?.emergencyPhone ?? "",
    photoUrl: user?.image ?? "",
  };

  return (
    <>
      <MemberHeader title="My Profile" />
      <div className="flex-1 p-6">
        <div className="max-w-2xl">
          <div className="rounded-2xl border border-border bg-white p-6 md:p-8">
            <h2 className="type-subheading mb-1">Personal information</h2>
            <p className="type-body-sm text-muted-foreground mb-6">
              Keep your contact details up to date. Your profile photo helps
              administrators recognize you during approval.
            </p>
            <MemberProfileForm profile={profile} />
          </div>
        </div>
      </div>
    </>
  );
}
