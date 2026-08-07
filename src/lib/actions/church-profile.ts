"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { hasAdminRole } from "@/lib/auth/permissions";
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

    revalidatePath("/admin/settings");
    revalidatePath("/");
    revalidatePath("/about");

    return { success: true };
  } catch {
    return { error: "Failed to save. Check your database connection." };
  }
}
