"use server";

import { revalidatePath } from "next/cache";
import { ADMIN_BASE_PATH } from "@/lib/constants/admin";
import { createAuditLog } from "@/lib/security/audit-log";
import { db } from "@/lib/db";
import { requireAdmin, type ActionState } from "@/lib/actions/admin-helpers";

// ─── Events ───────────────────────────────────────────────────────

export async function updateEventAction(_prev: ActionState, formData: FormData) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const id = formData.get("id") as string;
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const startDate = formData.get("startDate") as string;
  const venue = (formData.get("venue") as string)?.trim();
  const speaker = (formData.get("speaker") as string)?.trim();
  const isPublished = formData.get("isPublished") === "on";

  if (!id || !title || !startDate) {
    return { error: "Title and start date are required." };
  }

  try {
    await db.event.update({
      where: { id },
      data: {
        title,
        description: description || null,
        startDate: new Date(startDate),
        venue: venue || null,
        speaker: speaker || null,
        isPublished,
      },
    });

    await createAuditLog({
      userId: authResult.session!.user.id,
      action: "update",
      resource: "event",
      resourceId: id,
      details: { title },
    });

    revalidatePath("/events");
    revalidatePath(`${ADMIN_BASE_PATH}/events`);
    return { success: true };
  } catch {
    return { error: "Failed to update event." };
  }
}

export async function deleteEventAction(_prev: ActionState, formData: FormData) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const id = formData.get("id") as string;
  if (!id) return { error: "Missing record id." };

  try {
    await db.event.delete({ where: { id } });
    await createAuditLog({
      userId: authResult.session!.user.id,
      action: "delete",
      resource: "event",
      resourceId: id,
    });
    revalidatePath("/events");
    revalidatePath(`${ADMIN_BASE_PATH}/events`);
    return { success: true };
  } catch {
    return { error: "Failed to delete event." };
  }
}

// ─── Ministries ───────────────────────────────────────────────────

export async function updateMinistryAction(_prev: ActionState, formData: FormData) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const id = formData.get("id") as string;
  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const schedule = (formData.get("schedule") as string)?.trim();
  const location = (formData.get("location") as string)?.trim();
  const isPublished = formData.get("isPublished") === "on";

  if (!id || !name) return { error: "Ministry name is required." };

  try {
    await db.ministry.update({
      where: { id },
      data: {
        name,
        description: description || null,
        schedule: schedule || null,
        location: location || null,
        isPublished,
      },
    });

    await createAuditLog({
      userId: authResult.session!.user.id,
      action: "update",
      resource: "ministry",
      resourceId: id,
      details: { name },
    });

    revalidatePath("/ministries");
    revalidatePath(`${ADMIN_BASE_PATH}/ministries`);
    return { success: true };
  } catch {
    return { error: "Failed to update ministry." };
  }
}

export async function deleteMinistryAction(_prev: ActionState, formData: FormData) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const id = formData.get("id") as string;
  if (!id) return { error: "Missing record id." };

  try {
    await db.ministry.delete({ where: { id } });
    await createAuditLog({
      userId: authResult.session!.user.id,
      action: "delete",
      resource: "ministry",
      resourceId: id,
    });
    revalidatePath("/ministries");
    revalidatePath(`${ADMIN_BASE_PATH}/ministries`);
    return { success: true };
  } catch {
    return { error: "Failed to delete ministry." };
  }
}

// ─── Campaigns ────────────────────────────────────────────────────

export async function updateCampaignAction(_prev: ActionState, formData: FormData) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const id = formData.get("id") as string;
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const goalAmount = formData.get("goalAmount") as string;
  const isPublished = formData.get("isPublished") === "on";

  if (!id || !title) return { error: "Campaign title is required." };

  try {
    await db.campaign.update({
      where: { id },
      data: {
        title,
        description: description || null,
        goalAmount: goalAmount ? parseFloat(goalAmount) : null,
        isPublished,
      },
    });

    await createAuditLog({
      userId: authResult.session!.user.id,
      action: "update",
      resource: "campaign",
      resourceId: id,
      details: { title },
    });

    revalidatePath("/campaigns");
    revalidatePath(`${ADMIN_BASE_PATH}/campaigns`);
    return { success: true };
  } catch {
    return { error: "Failed to update campaign." };
  }
}

export async function deleteCampaignAction(_prev: ActionState, formData: FormData) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const id = formData.get("id") as string;
  if (!id) return { error: "Missing record id." };

  try {
    await db.campaign.delete({ where: { id } });
    await createAuditLog({
      userId: authResult.session!.user.id,
      action: "delete",
      resource: "campaign",
      resourceId: id,
    });
    revalidatePath("/campaigns");
    revalidatePath(`${ADMIN_BASE_PATH}/campaigns`);
    return { success: true };
  } catch {
    return { error: "Failed to delete campaign." };
  }
}
