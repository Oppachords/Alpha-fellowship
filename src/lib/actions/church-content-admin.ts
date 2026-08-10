"use server";

import { revalidatePath } from "next/cache";
import { ADMIN_BASE_PATH } from "@/lib/constants/admin";
import { createAuditLog } from "@/lib/security/audit-log";
import { db } from "@/lib/db";
import { requireAdmin, type ActionState } from "@/lib/actions/admin-helpers";
import { slugify } from "@/lib/utils/slugify";

export async function updateServiceAction(_prev: ActionState, formData: FormData) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const id = formData.get("id") as string;
  const name = (formData.get("name") as string)?.trim();
  const dayOfWeek = Number(formData.get("dayOfWeek"));
  const startTime = (formData.get("startTime") as string)?.trim();
  const endTime = (formData.get("endTime") as string)?.trim();
  const venue = (formData.get("venue") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const isActive = formData.get("isActive") === "on";

  if (!id || !name || Number.isNaN(dayOfWeek) || !startTime) {
    return { error: "Name, day, and start time are required." };
  }

  try {
    await db.service.update({
      where: { id },
      data: {
        name,
        dayOfWeek,
        startTime,
        endTime: endTime || null,
        venue: venue || null,
        description: description || null,
        isActive,
      },
    });

    await createAuditLog({
      userId: authResult.session!.user.id,
      action: "update",
      resource: "service",
      resourceId: id,
      details: { name },
    });

    revalidatePath("/services");
    revalidatePath("/");
    revalidatePath(`${ADMIN_BASE_PATH}/services`);
    return { success: true };
  } catch {
    return { error: "Failed to update service." };
  }
}

export async function deleteServiceAction(_prev: ActionState, formData: FormData) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const id = formData.get("id") as string;
  if (!id) return { error: "Missing record id." };

  try {
    await db.service.delete({ where: { id } });
    await createAuditLog({
      userId: authResult.session!.user.id,
      action: "delete",
      resource: "service",
      resourceId: id,
    });
    revalidatePath("/services");
    revalidatePath("/");
    revalidatePath(`${ADMIN_BASE_PATH}/services`);
    return { success: true };
  } catch {
    return { error: "Failed to delete service." };
  }
}

export async function updateProgramAction(_prev: ActionState, formData: FormData) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const id = formData.get("id") as string;
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const schedule = (formData.get("schedule") as string)?.trim();
  const location = (formData.get("location") as string)?.trim();
  const isPublished = formData.get("isPublished") === "on";

  if (!id || !title) return { error: "Program title is required." };

  try {
    await db.program.update({
      where: { id },
      data: {
        title,
        description: description || null,
        schedule: schedule || null,
        location: location || null,
        isPublished,
      },
    });

    await createAuditLog({
      userId: authResult.session!.user.id,
      action: "update",
      resource: "program",
      resourceId: id,
      details: { title },
    });

    revalidatePath("/services");
    revalidatePath("/programs");
    revalidatePath("/ministries");
    revalidatePath(`${ADMIN_BASE_PATH}/programs`);
    return { success: true };
  } catch {
    return { error: "Failed to update program." };
  }
}

export async function deleteProgramAction(_prev: ActionState, formData: FormData) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const id = formData.get("id") as string;
  if (!id) return { error: "Missing record id." };

  try {
    await db.program.delete({ where: { id } });
    await createAuditLog({
      userId: authResult.session!.user.id,
      action: "delete",
      resource: "program",
      resourceId: id,
    });
    revalidatePath("/services");
    revalidatePath("/programs");
    revalidatePath(`${ADMIN_BASE_PATH}/programs`);
    return { success: true };
  } catch {
    return { error: "Failed to delete program." };
  }
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
    revalidatePath("/programs");
    revalidatePath("/ministries");
    revalidatePath(`${ADMIN_BASE_PATH}/programs`);
    return { success: true };
  } catch {
    return { error: "Failed to create program. Check database connection." };
  }
}
