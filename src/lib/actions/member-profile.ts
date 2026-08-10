"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function updateMemberProfileAction(
  _prevState: { success?: boolean; error?: string } | undefined,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in to update your profile." };
  }

  const phone = (formData.get("phone") as string)?.trim();
  const address = (formData.get("address") as string)?.trim();
  const emergencyContact = (formData.get("emergencyContact") as string)?.trim();
  const emergencyPhone = (formData.get("emergencyPhone") as string)?.trim();
  const photoUrl = (formData.get("photoUrl") as string)?.trim();

  try {
    await db.user.update({
      where: { id: session.user.id },
      data: {
        phone: phone || null,
        ...(photoUrl ? { image: photoUrl } : {}),
      },
    });

    await db.member.upsert({
      where: { userId: session.user.id },
      update: {
        address: address || null,
        emergencyContact: emergencyContact || null,
        emergencyPhone: emergencyPhone || null,
      },
      create: {
        userId: session.user.id,
        address: address || null,
        emergencyContact: emergencyContact || null,
        emergencyPhone: emergencyPhone || null,
      },
    });

    revalidatePath("/member/profile");
    return { success: true };
  } catch {
    return { error: "Failed to save profile. Please try again." };
  }
}
