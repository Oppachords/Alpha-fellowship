"use server";

import { notifyStaff } from "@/lib/email/send-email";
import { prayerRequestEmail, counsellingRequestEmail } from "@/lib/email/templates";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const PRAYER_CATEGORIES = [
  "personal",
  "family",
  "health",
  "thanksgiving",
  "other",
] as const;

export async function submitPrayerRequestAction(
  _prevState: { success?: boolean; error?: string } | undefined,
  formData: FormData
) {
  const session = await auth();
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const request = (formData.get("request") as string)?.trim();
  const category = (formData.get("category") as string)?.trim() || "personal";
  const preferredContact = (formData.get("preferredContact") as string)?.trim();
  const isAnonymous = formData.get("isAnonymous") === "on";
  const hasConsent = formData.get("hasConsent") === "on";

  if (!name || !email || !request) {
    return { error: "Name, email, and prayer request are required." };
  }

  if (!hasConsent) {
    return { error: "Please consent to pastoral follow-up." };
  }

  if (!PRAYER_CATEGORIES.includes(category as (typeof PRAYER_CATEGORIES)[number])) {
    return { error: "Please select a valid category." };
  }

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
        name: isAnonymous ? "Anonymous" : name,
        email,
        phone: phone || null,
        request,
        category,
        preferredContact: preferredContact || null,
        isAnonymous,
        hasConsent,
      },
    });

    await notifyStaff(
      "New prayer request",
      prayerRequestEmail({
        name: isAnonymous ? "Anonymous" : name,
        email,
        category,
        request,
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
  const session = await auth();
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const preferredContact = (formData.get("preferredContact") as string)?.trim();
  const preferredDateTime = (formData.get("preferredDateTime") as string)?.trim();
  const reason = (formData.get("reason") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();
  const hasConsent = formData.get("hasConsent") === "on";

  if (!name || !email) {
    return { error: "Name and email are required." };
  }

  if (!hasConsent) {
    return { error: "Please consent to pastoral follow-up." };
  }

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
        name,
        email,
        phone: phone || null,
        preferredContact: preferredContact || null,
        preferredDateTime: preferredDateTime || null,
        reason: reason || null,
        message: message || null,
        hasConsent,
      },
    });

    await notifyStaff(
      "New counselling request",
      counsellingRequestEmail({ name, email, phone, message: message ?? reason })
    );

    return { success: true };
  } catch {
    return {
      error:
        "Unable to submit your request right now. Database setup is required — please try again later or contact the church office.",
    };
  }
}
