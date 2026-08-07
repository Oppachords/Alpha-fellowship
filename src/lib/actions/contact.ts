"use server";

import { notifyStaff } from "@/lib/email/send-email";
import { contactMessageEmail } from "@/lib/email/templates";
import { db } from "@/lib/db";

export async function submitContactAction(
  _prevState: { success?: boolean; error?: string } | undefined,
  formData: FormData
) {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!name || !email || !message) {
    return { error: "Name, email, and message are required." };
  }

  try {
    await db.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject: "Website contact",
        message,
      },
    });
  } catch {
    return {
      error:
        "Unable to send your message right now. Database setup is required — please try again later or contact the church office.",
    };
  }

  await notifyStaff(
    "New contact message",
    contactMessageEmail({ name, email, phone, message })
  );

  return { success: true };
}
