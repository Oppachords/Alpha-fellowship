"use server";

import { revalidatePath } from "next/cache";
import { ADMIN_BASE_PATH } from "@/lib/constants/admin";
import { createAuditLog } from "@/lib/security/audit-log";
import { db } from "@/lib/db";
import { requireAdmin, type ActionState } from "@/lib/actions/admin-helpers";
import { slugify } from "@/lib/utils/slugify";

function revalidateContent(paths: string[]) {
  for (const path of paths) {
    revalidatePath(path);
  }
}

// ─── Leaders ──────────────────────────────────────────────────────

export async function createLeaderAction(_prev: ActionState, formData: FormData) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const name = (formData.get("name") as string)?.trim();
  const position = (formData.get("position") as string)?.trim();
  const bio = (formData.get("bio") as string)?.trim();
  const photoUrl = (formData.get("photoUrl") as string)?.trim();
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  const publishNow = formData.get("publishNow") === "on";

  if (!name || !position) {
    return { error: "Name and position are required." };
  }

  try {
    const leader = await db.leader.create({
      data: {
        name,
        position,
        bio: bio || null,
        photoUrl: photoUrl || null,
        sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
        isPublished: publishNow,
      },
    });

    await createAuditLog({
      userId: authResult.session!.user.id,
      action: "create",
      resource: "leader",
      resourceId: leader.id,
      details: { name },
    });

    revalidateContent(["/about", `${ADMIN_BASE_PATH}/leaders`]);
    return { success: true };
  } catch {
    return { error: "Failed to create leader." };
  }
}

export async function updateLeaderAction(_prev: ActionState, formData: FormData) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const id = formData.get("id") as string;
  const name = (formData.get("name") as string)?.trim();
  const position = (formData.get("position") as string)?.trim();
  const bio = (formData.get("bio") as string)?.trim();
  const photoUrl = (formData.get("photoUrl") as string)?.trim();
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  const isPublished = formData.get("isPublished") === "on";

  if (!id || !name || !position) {
    return { error: "Name and position are required." };
  }

  try {
    await db.leader.update({
      where: { id },
      data: {
        name,
        position,
        bio: bio || null,
        photoUrl: photoUrl || null,
        sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
        isPublished,
      },
    });

    await createAuditLog({
      userId: authResult.session!.user.id,
      action: "update",
      resource: "leader",
      resourceId: id,
      details: { name },
    });

    revalidateContent(["/about", `${ADMIN_BASE_PATH}/leaders`]);
    return { success: true };
  } catch {
    return { error: "Failed to update leader." };
  }
}

export async function deleteLeaderAction(_prev: ActionState, formData: FormData) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const id = formData.get("id") as string;
  if (!id) return { error: "Missing record id." };

  try {
    await db.leader.delete({ where: { id } });
    await createAuditLog({
      userId: authResult.session!.user.id,
      action: "delete",
      resource: "leader",
      resourceId: id,
    });
    revalidateContent(["/about", `${ADMIN_BASE_PATH}/leaders`]);
    return { success: true };
  } catch {
    return { error: "Failed to delete leader." };
  }
}

// ─── Gallery ──────────────────────────────────────────────────────

export async function createGalleryAction(_prev: ActionState, formData: FormData) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const coverImage = (formData.get("coverImage") as string)?.trim();
  const publishNow = formData.get("publishNow") === "on";

  if (!title) return { error: "Gallery title is required." };

  const slug = `${slugify(title)}-${Date.now()}`;

  try {
    const gallery = await db.gallery.create({
      data: {
        title,
        slug,
        description: description || null,
        coverImage: coverImage || null,
        isPublished: publishNow,
      },
    });

    await createAuditLog({
      userId: authResult.session!.user.id,
      action: "create",
      resource: "gallery",
      resourceId: gallery.id,
      details: { title },
    });

    revalidateContent(["/gallery", `${ADMIN_BASE_PATH}/gallery`]);
    return { success: true };
  } catch {
    return { error: "Failed to create gallery." };
  }
}

export async function updateGalleryAction(_prev: ActionState, formData: FormData) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const id = formData.get("id") as string;
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const coverImage = (formData.get("coverImage") as string)?.trim();
  const isPublished = formData.get("isPublished") === "on";

  if (!id || !title) return { error: "Title is required." };

  try {
    const gallery = await db.gallery.update({
      where: { id },
      data: {
        title,
        description: description || null,
        coverImage: coverImage || null,
        isPublished,
      },
    });

    await createAuditLog({
      userId: authResult.session!.user.id,
      action: "update",
      resource: "gallery",
      resourceId: id,
      details: { title },
    });

    revalidateContent(["/gallery", `/gallery/${gallery.slug}`, `${ADMIN_BASE_PATH}/gallery`]);
    return { success: true };
  } catch {
    return { error: "Failed to update gallery." };
  }
}

export async function deleteGalleryAction(_prev: ActionState, formData: FormData) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const id = formData.get("id") as string;
  if (!id) return { error: "Missing record id." };

  try {
    await db.gallery.delete({ where: { id } });
    await createAuditLog({
      userId: authResult.session!.user.id,
      action: "delete",
      resource: "gallery",
      resourceId: id,
    });
    revalidateContent(["/gallery", `${ADMIN_BASE_PATH}/gallery`]);
    return { success: true };
  } catch {
    return { error: "Failed to delete gallery." };
  }
}

export async function addGalleryItemAction(_prev: ActionState, formData: FormData) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const galleryId = formData.get("galleryId") as string;
  const imageUrl = (formData.get("imageUrl") as string)?.trim();
  const caption = (formData.get("caption") as string)?.trim();

  if (!galleryId || !imageUrl) {
    return { error: "Gallery and image are required." };
  }

  try {
    let media = await db.media.findFirst({ where: { url: imageUrl } });
    if (!media) {
      media = await db.media.create({
        data: {
          filename: imageUrl.split("/").pop() ?? "gallery-image",
          url: imageUrl,
          uploadedBy: authResult.session!.user.id,
          folder: "alpha-fellowship/gallery",
        },
      });
    }

    await db.galleryItem.create({
      data: {
        galleryId,
        mediaId: media.id,
        caption: caption || null,
      },
    });

    revalidateContent(["/gallery", `${ADMIN_BASE_PATH}/gallery`]);
    return { success: true };
  } catch {
    return { error: "Failed to add gallery image." };
  }
}

export async function deleteGalleryItemAction(_prev: ActionState, formData: FormData) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const id = formData.get("id") as string;
  if (!id) return { error: "Missing record id." };

  try {
    await db.galleryItem.delete({ where: { id } });
    revalidateContent(["/gallery", `${ADMIN_BASE_PATH}/gallery`]);
    return { success: true };
  } catch {
    return { error: "Failed to remove gallery image." };
  }
}

/** For use in server component forms (no useActionState). */
export async function deleteGalleryItemFormAction(formData: FormData) {
  await deleteGalleryItemAction(undefined, formData);
}

// ─── Sermons ──────────────────────────────────────────────────────

function extractYouTubeId(urlOrId: string) {
  const trimmed = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match?.[1] ?? null;
}

export async function createSermonAction(_prev: ActionState, formData: FormData) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const speaker = (formData.get("speaker") as string)?.trim();
  const youtubeInput = (formData.get("youtubeUrl") as string)?.trim();
  const sermonDate = formData.get("sermonDate") as string;
  const publishNow = formData.get("publishNow") === "on";

  if (!title) return { error: "Title is required." };

  const youtubeId = youtubeInput ? extractYouTubeId(youtubeInput) : null;
  const slug = `${slugify(title)}-${Date.now()}`;

  try {
    const sermon = await db.sermon.create({
      data: {
        title,
        slug,
        description: description || null,
        speaker: speaker || null,
        youtubeId,
        youtubeUrl: youtubeInput || null,
        thumbnailUrl: youtubeId
          ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
          : null,
        sermonDate: sermonDate ? new Date(sermonDate) : null,
        isPublished: publishNow,
      },
    });

    await createAuditLog({
      userId: authResult.session!.user.id,
      action: "create",
      resource: "sermon",
      resourceId: sermon.id,
      details: { title },
    });

    revalidateContent(["/watch-live", `${ADMIN_BASE_PATH}/sermons`]);
    return { success: true };
  } catch {
    return { error: "Failed to create sermon." };
  }
}

export async function updateSermonAction(_prev: ActionState, formData: FormData) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const id = formData.get("id") as string;
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const speaker = (formData.get("speaker") as string)?.trim();
  const youtubeInput = (formData.get("youtubeUrl") as string)?.trim();
  const sermonDate = formData.get("sermonDate") as string;
  const isPublished = formData.get("isPublished") === "on";

  if (!id || !title) return { error: "Title is required." };

  const youtubeId = youtubeInput ? extractYouTubeId(youtubeInput) : null;

  try {
    await db.sermon.update({
      where: { id },
      data: {
        title,
        description: description || null,
        speaker: speaker || null,
        youtubeId,
        youtubeUrl: youtubeInput || null,
        thumbnailUrl: youtubeId
          ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
          : null,
        sermonDate: sermonDate ? new Date(sermonDate) : null,
        isPublished,
      },
    });

    await createAuditLog({
      userId: authResult.session!.user.id,
      action: "update",
      resource: "sermon",
      resourceId: id,
      details: { title },
    });

    revalidateContent(["/watch-live", `${ADMIN_BASE_PATH}/sermons`]);
    return { success: true };
  } catch {
    return { error: "Failed to update sermon." };
  }
}

export async function deleteSermonAction(_prev: ActionState, formData: FormData) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const id = formData.get("id") as string;
  if (!id) return { error: "Missing record id." };

  try {
    await db.sermon.delete({ where: { id } });
    await createAuditLog({
      userId: authResult.session!.user.id,
      action: "delete",
      resource: "sermon",
      resourceId: id,
    });
    revalidateContent(["/watch-live", `${ADMIN_BASE_PATH}/sermons`]);
    return { success: true };
  } catch {
    return { error: "Failed to delete sermon." };
  }
}

// ─── Testimonials ─────────────────────────────────────────────────

export async function createTestimonialAction(_prev: ActionState, formData: FormData) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const name = (formData.get("name") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const photoUrl = (formData.get("photoUrl") as string)?.trim();
  const publishNow = formData.get("publishNow") === "on";
  const hasConsent = formData.get("hasConsent") === "on";

  if (!name || !content) return { error: "Name and content are required." };

  try {
    const testimonial = await db.testimonial.create({
      data: {
        name,
        content,
        photoUrl: photoUrl || null,
        hasConsent,
        isPublished: publishNow,
      },
    });

    await createAuditLog({
      userId: authResult.session!.user.id,
      action: "create",
      resource: "testimonial",
      resourceId: testimonial.id,
      details: { name },
    });

    revalidateContent(["/about", `${ADMIN_BASE_PATH}/testimonials`]);
    return { success: true };
  } catch {
    return { error: "Failed to create testimonial." };
  }
}

export async function updateTestimonialAction(_prev: ActionState, formData: FormData) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const id = formData.get("id") as string;
  const name = (formData.get("name") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const photoUrl = (formData.get("photoUrl") as string)?.trim();
  const isPublished = formData.get("isPublished") === "on";
  const hasConsent = formData.get("hasConsent") === "on";

  if (!id || !name || !content) return { error: "Name and content are required." };

  try {
    await db.testimonial.update({
      where: { id },
      data: {
        name,
        content,
        photoUrl: photoUrl || null,
        isPublished,
        hasConsent,
      },
    });

    await createAuditLog({
      userId: authResult.session!.user.id,
      action: "update",
      resource: "testimonial",
      resourceId: id,
      details: { name },
    });

    revalidateContent(["/about", `${ADMIN_BASE_PATH}/testimonials`]);
    return { success: true };
  } catch {
    return { error: "Failed to update testimonial." };
  }
}

export async function deleteTestimonialAction(_prev: ActionState, formData: FormData) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const id = formData.get("id") as string;
  if (!id) return { error: "Missing record id." };

  try {
    await db.testimonial.delete({ where: { id } });
    await createAuditLog({
      userId: authResult.session!.user.id,
      action: "delete",
      resource: "testimonial",
      resourceId: id,
    });
    revalidateContent(["/about", `${ADMIN_BASE_PATH}/testimonials`]);
    return { success: true };
  } catch {
    return { error: "Failed to delete testimonial." };
  }
}

// ─── FAQ ──────────────────────────────────────────────────────────

export async function createFaqAction(_prev: ActionState, formData: FormData) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const question = (formData.get("question") as string)?.trim();
  const answer = (formData.get("answer") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();
  const publishNow = formData.get("publishNow") === "on";

  if (!question || !answer) return { error: "Question and answer are required." };

  try {
    const faq = await db.fAQ.create({
      data: {
        question,
        answer,
        category: category || null,
        isPublished: publishNow,
      },
    });

    await createAuditLog({
      userId: authResult.session!.user.id,
      action: "create",
      resource: "faq",
      resourceId: faq.id,
      details: { question },
    });

    revalidateContent(["/faq", `${ADMIN_BASE_PATH}/faq`]);
    return { success: true };
  } catch {
    return { error: "Failed to create FAQ." };
  }
}

export async function updateFaqAction(_prev: ActionState, formData: FormData) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const id = formData.get("id") as string;
  const question = (formData.get("question") as string)?.trim();
  const answer = (formData.get("answer") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();
  const isPublished = formData.get("isPublished") === "on";

  if (!id || !question || !answer) return { error: "Question and answer are required." };

  try {
    await db.fAQ.update({
      where: { id },
      data: {
        question,
        answer,
        category: category || null,
        isPublished,
      },
    });

    await createAuditLog({
      userId: authResult.session!.user.id,
      action: "update",
      resource: "faq",
      resourceId: id,
      details: { question },
    });

    revalidateContent(["/faq", `${ADMIN_BASE_PATH}/faq`]);
    return { success: true };
  } catch {
    return { error: "Failed to update FAQ." };
  }
}

export async function deleteFaqAction(_prev: ActionState, formData: FormData) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const id = formData.get("id") as string;
  if (!id) return { error: "Missing record id." };

  try {
    await db.fAQ.delete({ where: { id } });
    await createAuditLog({
      userId: authResult.session!.user.id,
      action: "delete",
      resource: "faq",
      resourceId: id,
    });
    revalidateContent(["/faq", `${ADMIN_BASE_PATH}/faq`]);
    return { success: true };
  } catch {
    return { error: "Failed to delete FAQ." };
  }
}

// ─── Announcements ────────────────────────────────────────────────

export async function createAnnouncementAction(_prev: ActionState, formData: FormData) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const title = (formData.get("title") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const type = (formData.get("type") as string)?.trim() || "general";
  const publishNow = formData.get("publishNow") === "on";

  if (!title || !content) return { error: "Title and content are required." };

  try {
    const announcement = await db.announcement.create({
      data: {
        title,
        content,
        type,
        isPublished: publishNow,
      },
    });

    await createAuditLog({
      userId: authResult.session!.user.id,
      action: "create",
      resource: "announcement",
      resourceId: announcement.id,
      details: { title },
    });

    revalidateContent(["/", `${ADMIN_BASE_PATH}/announcements`]);
    return { success: true };
  } catch {
    return { error: "Failed to create announcement." };
  }
}

export async function updateAnnouncementAction(_prev: ActionState, formData: FormData) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const id = formData.get("id") as string;
  const title = (formData.get("title") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const type = (formData.get("type") as string)?.trim() || "general";
  const isPublished = formData.get("isPublished") === "on";

  if (!id || !title || !content) return { error: "Title and content are required." };

  try {
    await db.announcement.update({
      where: { id },
      data: { title, content, type, isPublished },
    });

    await createAuditLog({
      userId: authResult.session!.user.id,
      action: "update",
      resource: "announcement",
      resourceId: id,
      details: { title },
    });

    revalidateContent(["/", `${ADMIN_BASE_PATH}/announcements`]);
    return { success: true };
  } catch {
    return { error: "Failed to update announcement." };
  }
}

export async function deleteAnnouncementAction(_prev: ActionState, formData: FormData) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const id = formData.get("id") as string;
  if (!id) return { error: "Missing record id." };

  try {
    await db.announcement.delete({ where: { id } });
    await createAuditLog({
      userId: authResult.session!.user.id,
      action: "delete",
      resource: "announcement",
      resourceId: id,
    });
    revalidateContent(["/", `${ADMIN_BASE_PATH}/announcements`]);
    return { success: true };
  } catch {
    return { error: "Failed to delete announcement." };
  }
}
