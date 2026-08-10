"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { hasAdminRole } from "@/lib/auth/permissions";
import { ADMIN_BASE_PATH } from "@/lib/constants/admin";
import { createAuditLog } from "@/lib/security/audit-log";
import { db } from "@/lib/db";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function requireContentAuthor() {
  const session = await auth();
  if (!session?.user || !hasAdminRole(session.user.roles)) {
    return { error: "Unauthorized." as const, session: null };
  }
  return { error: null, session };
}

export async function createBlogPostAction(
  _prevState: { success?: boolean; error?: string } | undefined,
  formData: FormData
) {
  const authResult = await requireContentAuthor();
  if (authResult.error) return { error: authResult.error };

  const title = (formData.get("title") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const featuredImage = (formData.get("featuredImage") as string)?.trim();
  const publishNow = formData.get("publishNow") === "on";

  if (!title || !content) {
    return { error: "Title and content are required." };
  }

  const baseSlug = slugify(title) || "post";
  const slug = `${baseSlug}-${Date.now()}`;

  try {
    const post = await db.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        featuredImage: featuredImage || null,
        authorId: authResult.session!.user.id,
        status: publishNow ? "published" : "draft",
        publishedAt: publishNow ? new Date() : null,
      },
    });

    await createAuditLog({
      userId: authResult.session!.user.id,
      action: "create",
      resource: "blog_post",
      resourceId: post.id,
      details: { title, publishNow },
    });

    revalidatePath("/blog");
    revalidatePath(`${ADMIN_BASE_PATH}/blog`);
    if (publishNow) {
      revalidatePath(`/blog/${post.slug}`);
    }

    return { success: true };
  } catch {
    return { error: "Failed to create blog post." };
  }
}
