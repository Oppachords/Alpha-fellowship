"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { hasAdminRole } from "@/lib/auth/permissions";
import { ADMIN_BASE_PATH } from "@/lib/constants/admin";
import { createAuditLog } from "@/lib/security/audit-log";
import { db } from "@/lib/db";

export async function approveMemberAction(userId: string) {
  const session = await auth();
  if (!session?.user || !hasAdminRole(session.user.roles)) {
    return { error: "Unauthorized." };
  }

  try {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return { error: "Member not found." };
    }

    await db.$transaction([
      db.user.update({
        where: { id: userId },
        data: { isActive: true },
      }),
      db.member.updateMany({
        where: { userId },
        data: { status: "ACTIVE", dateJoined: new Date() },
      }),
      db.membershipApplication.updateMany({
        where: { email: user.email, status: "pending" },
        data: { status: "approved", reviewedAt: new Date() },
      }),
    ]);

    await createAuditLog({
      userId: session.user.id,
      action: "approve",
      resource: "member",
      resourceId: userId,
      details: { email: user.email },
    });

    revalidatePath(`${ADMIN_BASE_PATH}/members`);
    return { success: true };
  } catch {
    return { error: "Failed to approve member. Check database connection." };
  }
}
