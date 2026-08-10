"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { hasAdminRole } from "@/lib/auth/permissions";
import { ADMIN_BASE_PATH } from "@/lib/constants/admin";
import { createAuditLog } from "@/lib/security/audit-log";
import { db } from "@/lib/db";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || !hasAdminRole(session.user.roles)) {
    return { error: "Unauthorized." as const, session: null };
  }
  return { error: null, session };
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createServiceAction(
  _prevState: { success?: boolean; error?: string } | undefined,
  formData: FormData
) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const name = (formData.get("name") as string)?.trim();
  const dayOfWeek = Number(formData.get("dayOfWeek"));
  const startTime = (formData.get("startTime") as string)?.trim();
  const endTime = (formData.get("endTime") as string)?.trim();
  const venue = (formData.get("venue") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();

  if (!name || Number.isNaN(dayOfWeek) || !startTime) {
    return { error: "Name, day, and start time are required." };
  }

  try {
    const service = await db.service.create({
      data: {
        name,
        dayOfWeek,
        startTime,
        endTime: endTime || null,
        venue: venue || null,
        description: description || null,
        isActive: true,
      },
    });

    await createAuditLog({
      userId: authResult.session!.user.id,
      action: "create",
      resource: "service",
      resourceId: service.id,
      details: { name },
    });

    revalidatePath("/services");
    revalidatePath("/");
    revalidatePath(`${ADMIN_BASE_PATH}/services`);
    return { success: true };
  } catch {
    return { error: "Failed to create service. Check database connection." };
  }
}

export async function createProgramAction(
  _prevState: { success?: boolean; error?: string } | undefined,
  formData: FormData
) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const schedule = (formData.get("schedule") as string)?.trim();
  const location = (formData.get("location") as string)?.trim();

  if (!title) {
    return { error: "Program title is required." };
  }

  try {
    const program = await db.program.create({
      data: {
        title,
        slug: `${slugify(title)}-${Date.now()}`,
        description: description || null,
        schedule: schedule || null,
        location: location || null,
        isPublished: true,
      },
    });

    await createAuditLog({
      userId: authResult.session!.user.id,
      action: "create",
      resource: "program",
      resourceId: program.id,
      details: { title },
    });

    revalidatePath("/services");
    revalidatePath("/ministries");
    revalidatePath(`${ADMIN_BASE_PATH}/programs`);
    return { success: true };
  } catch {
    return { error: "Failed to create program. Check database connection." };
  }
}
