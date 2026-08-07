import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { hasAdminRole } from "@/lib/auth/permissions";
import { ADMIN_BASE_PATH } from "@/lib/constants/admin";
import { MEMBER_BASE_PATH } from "@/lib/constants/member";

export default async function AuthRedirectPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (hasAdminRole(session.user.roles)) {
    redirect(ADMIN_BASE_PATH);
  }

  redirect(MEMBER_BASE_PATH);
}
