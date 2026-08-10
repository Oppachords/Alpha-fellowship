"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { hasAdminRole } from "@/lib/auth/permissions";
import { ADMIN_BASE_PATH } from "@/lib/constants/admin";
import { createAuditLog } from "@/lib/security/audit-log";
import { db } from "@/lib/db";

export async function changeAdminPasswordAction(
  _prevState: { success?: boolean; error?: string } | undefined,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user || !hasAdminRole(session.user.roles)) {
    return { error: "Unauthorized." };
  }

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword) {
    return { error: "Current and new passwords are required." };
  }

  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match." };
  }

  try {
    const user = await db.user.findUnique({ where: { id: session.user.id } });
    if (!user?.passwordHash) {
      return { error: "Account not found." };
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      return { error: "Current password is incorrect." };
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await db.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    await createAuditLog({
      userId: user.id,
      action: "update",
      resource: "password",
      resourceId: user.id,
    });

    revalidatePath(`${ADMIN_BASE_PATH}/settings`);
    return { success: true };
  } catch {
    return { error: "Failed to update password." };
  }
}

export async function createMemberByAdminAction(
  _prevState: { success?: boolean; error?: string } | undefined,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user || !hasAdminRole(session.user.roles)) {
    return { error: "Unauthorized." };
  }

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const phone = (formData.get("phone") as string)?.trim();
  const password = formData.get("password") as string;
  const activateNow = formData.get("activateNow") === "on";

  if (!name || !email || !password) {
    return { error: "Name, email, and password are required." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  try {
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return { error: "A user with this email already exists." };
    }

    const memberRole = await db.role.findUnique({ where: { slug: "member" } });
    if (!memberRole) {
      return { error: "Member role is not configured." };
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        passwordHash,
        isActive: activateNow,
        roles: { create: { roleId: memberRole.id } },
        member: {
          create: {
            status: activateNow ? "ACTIVE" : "VISITOR",
            dateJoined: activateNow ? new Date() : null,
          },
        },
      },
    });

    await createAuditLog({
      userId: session.user.id,
      action: "create",
      resource: "member",
      resourceId: user.id,
      details: { email, activateNow },
    });

    revalidatePath(`${ADMIN_BASE_PATH}/members`);
    return { success: true };
  } catch {
    return { error: "Failed to create member." };
  }
}
