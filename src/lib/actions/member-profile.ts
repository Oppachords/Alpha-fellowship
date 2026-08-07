"use server";

import { auth } from "@/lib/auth";

export async function updateMemberProfileAction(
  _prevState: { success?: boolean; error?: string } | undefined,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user) {
    return { error: "You must be signed in to update your profile." };
  }

  const phone = (formData.get("phone") as string)?.trim();
  const address = (formData.get("address") as string)?.trim();
  const emergencyContact = (formData.get("emergencyContact") as string)?.trim();
  const emergencyPhone = (formData.get("emergencyPhone") as string)?.trim();

  // Database integration will update Member records in a later phase.
  void phone;
  void address;
  void emergencyContact;
  void emergencyPhone;

  return { success: true };
}
