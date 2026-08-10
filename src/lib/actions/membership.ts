"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { notifyStaff } from "@/lib/email/send-email";
import { memberRegistrationEmail } from "@/lib/email/templates";
import { guardPublicForm } from "@/lib/security/public-form-guard";
import {
  emailSchema,
  firstZodError,
  messageSchema,
  nameSchema,
  passwordSchema,
  phoneSchema,
} from "@/lib/validations/common";
import { db } from "@/lib/db";

const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    message: z.string().trim().max(2000).optional().or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export async function registerMemberAction(
  _prevState: { success?: boolean; error?: string } | undefined,
  formData: FormData
) {
  const guard = await guardPublicForm(formData, {
    scope: "member-register",
    limit: 3,
    windowMs: 60 * 60 * 1000,
  });
  if (guard?.honeypot) return { success: true };
  if (guard?.error) return { error: guard.error };

  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") ?? "",
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    message: formData.get("message") ?? "",
  });

  if (!parsed.success) {
    return { error: firstZodError(parsed.error) };
  }

  const { name, email, phone, password, message } = parsed.data;
  const normalizedEmail = email.toLowerCase();
  const photoUrl = (formData.get("photoUrl") as string)?.trim() || null;

  try {
    const existing = await db.user.findUnique({ where: { email: normalizedEmail } });
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
        email: normalizedEmail,
        phone: phone || null,
        passwordHash,
        image: photoUrl || null,
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
        email: normalizedEmail,
        phone: phone || null,
        message: message || null,
        status: "pending",
      },
    });

    await notifyStaff(
      "New member registration",
      memberRegistrationEmail({ name, email: normalizedEmail, phone })
    );

    return { success: true };
  } catch {
    return {
      error:
        "Registration is not available yet. Database setup is required — please try again later or contact the church office.",
    };
  }
}
