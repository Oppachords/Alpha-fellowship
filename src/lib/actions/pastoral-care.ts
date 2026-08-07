"use server";

import { z } from "zod";
import { notifyStaff } from "@/lib/email/send-email";
import { prayerRequestEmail, counsellingRequestEmail } from "@/lib/email/templates";
import { auth } from "@/lib/auth";
import { guardPublicForm } from "@/lib/security/public-form-guard";
import {
  emailSchema,
  firstZodError,
  messageSchema,
  nameSchema,
  phoneSchema,
} from "@/lib/validations/common";
import { db } from "@/lib/db";

const PRAYER_CATEGORIES = [
  "personal",
  "family",
  "health",
  "thanksgiving",
  "other",
] as const;

const prayerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  request: messageSchema.max(3000),
  category: z.enum(PRAYER_CATEGORIES),
  preferredContact: z.string().trim().max(120).optional().or(z.literal("")),
  isAnonymous: z.boolean(),
});

const counsellingSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  preferredContact: z.string().trim().max(120).optional().or(z.literal("")),
  preferredDateTime: z.string().trim().max(120).optional().or(z.literal("")),
  reason: z.string().trim().max(500).optional().or(z.literal("")),
  message: z.string().trim().max(3000).optional().or(z.literal("")),
});

export async function submitPrayerRequestAction(
  _prevState: { success?: boolean; error?: string } | undefined,
  formData: FormData
) {
  const guard = await guardPublicForm(formData, { scope: "prayer-request", limit: 6 });
  if (guard?.honeypot) return { success: true };
  if (guard?.error) return { error: guard.error };

  if (formData.get("hasConsent") !== "on") {
    return { error: "Please consent to pastoral follow-up." };
  }

  const session = await auth();
  const parsed = prayerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") ?? "",
    request: formData.get("request"),
    category: (formData.get("category") as string)?.trim() || "personal",
    preferredContact: formData.get("preferredContact") ?? "",
    isAnonymous: formData.get("isAnonymous") === "on",
  });

  if (!parsed.success) {
    return { error: firstZodError(parsed.error) };
  }

  const data = parsed.data;

  try {
    let memberId: string | undefined;
    if (session?.user?.id) {
      const member = await db.member.findUnique({
        where: { userId: session.user.id },
      });
      memberId = member?.id;
    }

    await db.prayerRequest.create({
      data: {
        memberId,
        name: data.isAnonymous ? "Anonymous" : data.name,
        email: data.email,
        phone: data.phone || null,
        request: data.request,
        category: data.category,
        preferredContact: data.preferredContact || null,
        isAnonymous: data.isAnonymous,
        hasConsent: true,
      },
    });

    await notifyStaff(
      "New prayer request",
      prayerRequestEmail({
        name: data.isAnonymous ? "Anonymous" : data.name,
        email: data.email,
        category: data.category,
        request: data.request,
      })
    );

    return { success: true };
  } catch {
    return {
      error:
        "Unable to submit your request right now. Database setup is required — please try again later or contact the church office.",
    };
  }
}

export async function submitCounsellingRequestAction(
  _prevState: { success?: boolean; error?: string } | undefined,
  formData: FormData
) {
  const guard = await guardPublicForm(formData, { scope: "counselling-request", limit: 6 });
  if (guard?.honeypot) return { success: true };
  if (guard?.error) return { error: guard.error };

  if (formData.get("hasConsent") !== "on") {
    return { error: "Please consent to pastoral follow-up." };
  }

  const session = await auth();
  const parsed = counsellingSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") ?? "",
    preferredContact: formData.get("preferredContact") ?? "",
    preferredDateTime: formData.get("preferredDateTime") ?? "",
    reason: formData.get("reason") ?? "",
    message: formData.get("message") ?? "",
  });

  if (!parsed.success) {
    return { error: firstZodError(parsed.error) };
  }

  const data = parsed.data;

  try {
    let memberId: string | undefined;
    if (session?.user?.id) {
      const member = await db.member.findUnique({
        where: { userId: session.user.id },
      });
      memberId = member?.id;
    }

    await db.counsellingRequest.create({
      data: {
        memberId,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        preferredContact: data.preferredContact || null,
        preferredDateTime: data.preferredDateTime || null,
        reason: data.reason || null,
        message: data.message || null,
        hasConsent: true,
      },
    });

    await notifyStaff(
      "New counselling request",
      counsellingRequestEmail({
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message ?? data.reason,
      })
    );

    return { success: true };
  } catch {
    return {
      error:
        "Unable to submit your request right now. Database setup is required — please try again later or contact the church office.",
    };
  }
}
