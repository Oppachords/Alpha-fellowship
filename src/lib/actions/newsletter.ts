"use server";

import { z } from "zod";
import { guardPublicForm } from "@/lib/security/public-form-guard";
import { emailSchema, firstZodError } from "@/lib/validations/common";
import { db } from "@/lib/db";

const subscribeSchema = z.object({
  email: emailSchema,
  name: z.string().trim().max(120).optional().or(z.literal("")),
});

export async function subscribeNewsletterAction(
  _prevState: { success?: boolean; error?: string } | undefined,
  formData: FormData
) {
  const guard = await guardPublicForm(formData, { scope: "newsletter", limit: 5 });
  if (guard?.honeypot) return { success: true };
  if (guard?.error) return { error: guard.error };

  if (formData.get("hasConsent") !== "on") {
    return { error: "Please consent to receive newsletter emails." };
  }

  const parsed = subscribeSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name") ?? "",
  });

  if (!parsed.success) {
    return { error: firstZodError(parsed.error) };
  }

  const { email, name } = parsed.data;

  try {
    await db.newsletterSubscriber.upsert({
      where: { email },
      update: {
        name: name || undefined,
        isActive: true,
        hasConsent: true,
        source: "website",
      },
      create: {
        email,
        name: name || null,
        hasConsent: true,
        isActive: true,
        source: "website",
      },
    });

    return { success: true };
  } catch {
    return { error: "Unable to subscribe right now. Please try again later." };
  }
}
