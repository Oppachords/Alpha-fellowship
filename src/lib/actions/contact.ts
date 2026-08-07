"use server";

import { notifyStaff } from "@/lib/email/send-email";
import { contactMessageEmail } from "@/lib/email/templates";
import { guardPublicForm } from "@/lib/security/public-form-guard";
import {
  emailSchema,
  firstZodError,
  messageSchema,
  nameSchema,
  phoneSchema,
} from "@/lib/validations/common";
import { db } from "@/lib/db";
import { z } from "zod";

const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  message: messageSchema,
});

export async function submitContactAction(
  _prevState: { success?: boolean; error?: string } | undefined,
  formData: FormData
) {
  const guard = await guardPublicForm(formData, { scope: "contact", limit: 8 });
  if (guard?.honeypot) return { success: true };
  if (guard?.error) return { error: guard.error };

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") ?? "",
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { error: firstZodError(parsed.error) };
  }

  const { name, email, phone, message } = parsed.data;

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
