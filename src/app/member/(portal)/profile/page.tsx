import { auth } from "@/lib/auth";
import { MemberHeader } from "@/components/member/member-header";
import { MemberProfileForm } from "@/components/member/member-profile-form";

export default async function MemberProfilePage() {
  const session = await auth();

  const profile = {
    name: session?.user?.name ?? "",
    email: session?.user?.email ?? "",
    phone: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
  };

  return (
    <>
      <MemberHeader title="My Profile" />
      <div className="flex-1 p-6">
        <div className="max-w-2xl">
          <div className="rounded-2xl border border-border bg-white p-6 md:p-8">
            <h2 className="type-subheading mb-1">Personal information</h2>
            <p className="type-body-sm text-muted-foreground mb-6">
              Keep your contact details up to date. Full profile sync activates
              when the database is connected.
            </p>
            <MemberProfileForm profile={profile} />
          </div>
        </div>
      </div>
    </>
  );
}
