"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { hasAdminRole } from "@/lib/auth/permissions";
import { db } from "@/lib/db";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || !hasAdminRole(session.user.roles)) {
    return { error: "Unauthorized." as const };
  }
  return null;
}

export async function createEventAction(
  _prevState: { success?: boolean; error?: string } | undefined,
  formData: FormData
) {
  const authResult = await requireAdmin();
  if (authResult) return authResult;

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const startDate = formData.get("startDate") as string;
  const venue = (formData.get("venue") as string)?.trim();
  const speaker = (formData.get("speaker") as string)?.trim();

  if (!title || !startDate) {
    return { error: "Title and start date are required." };
  }

  try {
    await db.event.create({
      data: {
        title,
        slug: `${slugify(title)}-${Date.now()}`,
        description: description || null,
        startDate: new Date(startDate),
        venue: venue || null,
        speaker: speaker || null,
        isPublished: true,
        status: "upcoming",
      },
    });

    revalidatePath("/events");
    revalidatePath("/church/admin/events");
    return { success: true };
  } catch {
    return { error: "Failed to create event. Check database connection." };
  }
}

export async function createMinistryAction(
  _prevState: { success?: boolean; error?: string } | undefined,
  formData: FormData
) {
  const authResult = await requireAdmin();
  if (authResult) return authResult;

  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const schedule = (formData.get("schedule") as string)?.trim();
  const location = (formData.get("location") as string)?.trim();

  if (!name) {
    return { error: "Ministry name is required." };
  }

  try {
    await db.ministry.create({
      data: {
        name,
        slug: slugify(name),
        description: description || null,
        schedule: schedule || null,
        location: location || null,
        isPublished: true,
      },
    });

    revalidatePath("/ministries");
    revalidatePath("/church/admin/ministries");
    return { success: true };
  } catch {
    return { error: "Failed to create ministry. Check database connection." };
  }
}

export async function createCampaignAction(
  _prevState: { success?: boolean; error?: string } | undefined,
  formData: FormData
) {
  const authResult = await requireAdmin();
  if (authResult) return authResult;

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const goalAmount = formData.get("goalAmount") as string;

  if (!title) {
    return { error: "Campaign title is required." };
  }

  try {
    await db.campaign.create({
      data: {
        title,
        slug: slugify(title),
        description: description || null,
        goalAmount: goalAmount ? parseFloat(goalAmount) : null,
        isPublished: true,
        status: "active",
      },
    });

    revalidatePath("/campaigns");
    revalidatePath("/church/admin/campaigns");
    return { success: true };
  } catch {
    return { error: "Failed to create campaign. Check database connection." };
  }
}

export async function registerForEventAction(
  _prevState: { success?: boolean; error?: string } | undefined,
  formData: FormData
) {
  const session = await auth();
  const eventId = formData.get("eventId") as string;
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();

  if (!eventId || !name || !email) {
    return { error: "Name and email are required." };
  }

  try {
    let memberId: string | undefined;
    if (session?.user?.id) {
      const member = await db.member.findUnique({
        where: { userId: session.user.id },
      });
      memberId = member?.id;
    }

    await db.eventRegistration.create({
      data: {
        eventId,
        memberId,
        name,
        email,
        phone: phone || null,
      },
    });

    revalidatePath("/events");
    revalidatePath("/member/events");
    return { success: true };
  } catch {
    return {
      error:
        "Unable to register right now. Database setup is required — please try again later.",
    };
  }
}
