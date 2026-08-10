"use server";

import { revalidatePath } from "next/cache";
import { ADMIN_BASE_PATH } from "@/lib/constants/admin";
import { createAuditLog } from "@/lib/security/audit-log";
import { db } from "@/lib/db";
import { requireAdmin, type ActionState } from "@/lib/actions/admin-helpers";

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
