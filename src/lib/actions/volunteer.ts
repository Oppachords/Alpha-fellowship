"use server";

import { z } from "zod";
import { guardPublicForm } from "@/lib/security/public-form-guard";
import {
  emailSchema,
  firstZodError,
  nameSchema,
  phoneSchema,
} from "@/lib/validations/common";
import { db } from "@/lib/db";

const volunteerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  areaOfInterest: z.string().trim().max(200).optional().or(z.literal("")),
  skills: z.string().trim().max(500).optional().or(z.literal("")),
  availability: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().max(3000).optional().or(z.literal("")),
});

export async function submitVolunteerApplicationAction(
  _prevState: { success?: boolean; error?: string } | undefined,
  formData: FormData
) {
  const guard = await guardPublicForm(formData, { scope: "volunteer", limit: 5 });
  if (guard?.honeypot) return { success: true };
  if (guard?.error) return { error: guard.error };

  const parsed = volunteerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") ?? "",
    areaOfInterest: formData.get("areaOfInterest") ?? "",
    skills: formData.get("skills") ?? "",
    availability: formData.get("availability") ?? "",
    message: formData.get("message") ?? "",
  });

  if (!parsed.success) {
    return { error: firstZodError(parsed.error) };
  }

  try {
    await db.volunteerApplication.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        areaOfInterest: parsed.data.areaOfInterest || null,
        skills: parsed.data.skills || null,
        availability: parsed.data.availability || null,
        message: parsed.data.message || null,
        status: "pending",
      },
    });

    return { success: true };
  } catch {
    return { error: "Unable to submit your application. Please try again later." };
  }
}
