"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { hasAdminRole } from "@/lib/auth/permissions";
import { ADMIN_BASE_PATH } from "@/lib/constants/admin";
import { db } from "@/lib/db";

export async function submitPaymentConfirmationAction(
  _prevState: { success?: boolean; error?: string } | undefined,
  formData: FormData
) {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const amount = (formData.get("amount") as string)?.trim();
  const paymentMethod = (formData.get("paymentMethod") as string)?.trim();
  const referenceNumber = (formData.get("referenceNumber") as string)?.trim();
  const purpose = (formData.get("purpose") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!name || !email || !paymentMethod) {
    return { error: "Name, email, and payment method are required." };
  }

  if (!referenceNumber) {
    return { error: "Please include your mobile money or bank reference number." };
  }

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

    revalidatePath("/give");
    revalidatePath(`${ADMIN_BASE_PATH}/payments`);
    return { success: true };
  } catch {
    return { error: "Failed to update payment method. Check database connection." };
  }
}
