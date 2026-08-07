"use server";

import bcrypt from "bcryptjs";
import { notifyStaff } from "@/lib/email/send-email";
import { memberRegistrationEmail } from "@/lib/email/templates";
import { db } from "@/lib/db";

export async function registerMemberAction(
  _prevState: { success?: boolean; error?: string } | undefined,
  formData: FormData
) {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const phone = (formData.get("phone") as string)?.trim();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const message = (formData.get("message") as string)?.trim();

  if (!name || !email || !password) {
    return { error: "Name, email, and password are required." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  try {
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return { error: "An account with this email already exists." };
    }

    const memberRole = await db.role.findUnique({ where: { slug: "member" } });
    if (!memberRole) {
      return { error: "Member role is not configured. Run database seed first." };
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await db.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        passwordHash,
        isActive: false,
        roles: {
          create: { roleId: memberRole.id },
        },
        member: {
          create: { status: "VISITOR" },
        },
      },
    });

    await db.membershipApplication.create({
      data: {
        name,
        email,
        phone: phone || null,
        message: message || null,
        status: "pending",
      },
    });

    await notifyStaff(
      "New member registration",
      memberRegistrationEmail({ name, email, phone })
    );

    return { success: true };
  } catch {
    return {
      error:
        "Registration is not available yet. Database setup is required — please try again later or contact the church office.",
    };
  }
}
