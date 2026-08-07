import { auth } from "@/lib/auth";
import { MemberHeader } from "@/components/member/member-header";
import { CounsellingRequestForm } from "@/components/member/counselling-request-form";

export default async function MemberCounsellingPage() {
  const session = await auth();

  return (
    <>
      <MemberHeader title="Counselling" />
      <div className="flex-1 p-6">
        <div className="max-w-2xl">
          <p className="type-body-sm text-muted-foreground mb-6">
            Request pastoral counselling and spiritual guidance. A leader will
            contact you to arrange a suitable time.
          </p>
          <CounsellingRequestForm
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
