"use server";

import { z } from "zod";
import { notifyStaff } from "@/lib/email/send-email";
import { paymentConfirmationEmail } from "@/lib/email/templates";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { hasAdminRole } from "@/lib/auth/permissions";
import { ADMIN_BASE_PATH } from "@/lib/constants/admin";
import { createAuditLog } from "@/lib/security/audit-log";
import { guardPublicForm } from "@/lib/security/public-form-guard";
import {
  emailSchema,
  firstZodError,
  messageSchema,
  nameSchema,
  phoneSchema,
} from "@/lib/validations/common";
import { db } from "@/lib/db";

const paymentConfirmationSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  amount: z.string().trim().max(20).optional().or(z.literal("")),
  paymentMethod: z.string().trim().min(1, "Payment method is required.").max(80),
  referenceNumber: z
    .string()
    .trim()
    .min(1, "Please include your mobile money or bank reference number.")
    .max(120),
  purpose: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

export async function submitPaymentConfirmationAction(
  _prevState: { success?: boolean; error?: string } | undefined,
  formData: FormData
) {
  const guard = await guardPublicForm(formData, { scope: "payment-confirmation", limit: 6 });
  if (guard?.honeypot) return { success: true };
  if (guard?.error) return { error: guard.error };

  const parsed = paymentConfirmationSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") ?? "",
    amount: formData.get("amount") ?? "",
    paymentMethod: formData.get("paymentMethod"),
    referenceNumber: formData.get("referenceNumber"),
    purpose: formData.get("purpose") ?? "",
    message: formData.get("message") ?? "",
  });

  if (!parsed.success) {
    return { error: firstZodError(parsed.error) };
  }

  const { name, email, phone, amount, paymentMethod, referenceNumber, purpose, message } =
    parsed.data;

  try {
    await db.paymentConfirmation.create({
      data: {
        name,
        email,
        phone: phone || null,
        amount: amount ? parseFloat(amount) : null,
        paymentMethod,
        referenceNumber,
        purpose: purpose || null,
        message: message || null,
        status: "pending",
      },
    });

    await notifyStaff(
      "New payment confirmation",
      paymentConfirmationEmail({ name, email, paymentMethod, referenceNumber, amount })
    );

    revalidatePath("/give");
    revalidatePath(`${ADMIN_BASE_PATH}/payments`);
    return { success: true };
  } catch {
    return {
      error:
        "Unable to submit confirmation right now. Database setup is required — please contact the church office with your reference number.",
    };
  }
}

export async function verifyPaymentConfirmationAction(id: string) {
  const session = await auth();
  if (!session?.user || !hasAdminRole(session.user.roles)) {
    return { error: "Unauthorized." };
  }

  try {
    await db.paymentConfirmation.update({
      where: { id },
      data: { status: "verified" },
    });

    await createAuditLog({
      userId: session.user.id,
      action: "verify",
      resource: "payment_confirmation",
      resourceId: id,
    });

    revalidatePath(`${ADMIN_BASE_PATH}/payments`);
    return { success: true };
  } catch {
    return { error: "Failed to verify payment. Check database connection." };
  }
}

export async function updatePaymentMethodAction(
  _prevState: { success?: boolean; error?: string } | undefined,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user || !hasAdminRole(session.user.roles)) {
    return { error: "Unauthorized." };
  }

  const id = formData.get("id") as string;
  const phoneNumber = (formData.get("phoneNumber") as string)?.trim();
  const merchantCode = (formData.get("merchantCode") as string)?.trim();
  const accountNumber = (formData.get("accountNumber") as string)?.trim();
  const instructions = (formData.get("instructions") as string)?.trim();

  if (!id) {
    return { error: "Payment method ID is required." };
  }

  try {
    await db.paymentMethod.update({
      where: { id },
      data: {
        phoneNumber: phoneNumber || null,
        merchantCode: merchantCode || null,
        accountNumber: accountNumber || null,
        instructions: instructions || null,
      },
    });

    await createAuditLog({
      userId: session.user.id,
      action: "update",
      resource: "payment_method",
      resourceId: id,
    });

    revalidatePath("/give");
    revalidatePath(`${ADMIN_BASE_PATH}/payments`);
    return { success: true };
  } catch {
    return { error: "Failed to update payment method. Check database connection." };
  }
}
