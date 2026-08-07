"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { ADMIN_BASE_PATH } from "@/lib/constants/admin";
import { hasAdminRole } from "@/lib/auth/permissions";
import { createAuditLog } from "@/lib/security/audit-log";
import { db } from "@/lib/db";

export async function updateChurchProfileAction(
  _prevState: { success?: boolean; error?: string } | undefined,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user || !hasAdminRole(session.user.roles)) {
    return { error: "Unauthorized." };
  }

  const name = formData.get("name") as string;
  const tagline = formData.get("tagline") as string;
  const mission = formData.get("mission") as string;
  const vision = formData.get("vision") as string;
  const story = formData.get("story") as string;

  if (!name?.trim()) {
    return { error: "Church name is required." };
  }

  try {
    await db.churchProfile.upsert({
      where: { id: "default" },
      update: {
        name: name.trim(),
        tagline: tagline.trim() || null,
        mission: mission.trim() || null,
        vision: vision.trim() || null,
        story: story.trim() || null,
      },
      create: {
        id: "default",
        name: name.trim(),
        tagline: tagline.trim() || null,
        mission: mission.trim() || null,
        vision: vision.trim() || null,
        story: story.trim() || null,
      },
    });

    await createAuditLog({
      userId: session.user.id,
      action: "update",
      resource: "church_profile",
      resourceId: "default",
    });

    revalidatePath(`${ADMIN_BASE_PATH}/settings`);
    revalidatePath("/");
    revalidatePath("/about");

    return { success: true };
  } catch {
    return { error: "Failed to save. Check your database connection." };
  }
}
