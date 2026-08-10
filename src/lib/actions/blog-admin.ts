"use server";

import { revalidatePath } from "next/cache";
import { ADMIN_BASE_PATH } from "@/lib/constants/admin";
import { createAuditLog } from "@/lib/security/audit-log";
import { db } from "@/lib/db";
import { requireAdmin, type ActionState } from "@/lib/actions/admin-helpers";
import { slugify } from "@/lib/utils/slugify";

export async function createBlogPostAction(
  _prevState: ActionState,
  formData: FormData
) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const title = (formData.get("title") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const featuredImage = (formData.get("featuredImage") as string)?.trim();
  const publishNow = formData.get("publishNow") === "on";

  if (!title || !content) {
    return { error: "Title and content are required." };
  }

  const slug = `${slugify(title)}-${Date.now()}`;

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
    if (publishNow) revalidatePath(`/blog/${post.slug}`);

    return { success: true };
  } catch {
    return { error: "Failed to create blog post." };
  }
}

export async function updateBlogPostAction(_prevState: ActionState, formData: FormData) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const id = formData.get("id") as string;
  const title = (formData.get("title") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const featuredImage = (formData.get("featuredImage") as string)?.trim();
  const publishNow = formData.get("publishNow") === "on";

  if (!id || !title || !content) {
    return { error: "Title and content are required." };
  }

  try {
    const existing = await db.blogPost.findUnique({ where: { id } });
    if (!existing) return { error: "Post not found." };

    const post = await db.blogPost.update({
      where: { id },
      data: {
        title,
        excerpt: excerpt || null,
        content,
        featuredImage: featuredImage || null,
        status: publishNow ? "published" : "draft",
        publishedAt:
          publishNow && !existing.publishedAt ? new Date() : existing.publishedAt,
      },
    });

    await createAuditLog({
      userId: authResult.session!.user.id,
      action: "update",
      resource: "blog_post",
      resourceId: id,
      details: { title, publishNow },
    });

    revalidatePath("/blog");
    revalidatePath(`${ADMIN_BASE_PATH}/blog`);
    revalidatePath(`/blog/${post.slug}`);
    if (existing.slug !== post.slug) revalidatePath(`/blog/${existing.slug}`);

    return { success: true };
  } catch {
    return { error: "Failed to update blog post." };
  }
}

export async function deleteBlogPostAction(_prevState: ActionState, formData: FormData) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const id = formData.get("id") as string;
  if (!id) return { error: "Missing record id." };

  try {
    const post = await db.blogPost.findUnique({ where: { id } });
    if (!post) return { error: "Post not found." };

    await db.blogPost.delete({ where: { id } });

    await createAuditLog({
      userId: authResult.session!.user.id,
      action: "delete",
      resource: "blog_post",
      resourceId: id,
    });

    revalidatePath("/blog");
    revalidatePath(`${ADMIN_BASE_PATH}/blog`);
    revalidatePath(`/blog/${post.slug}`);

    return { success: true };
  } catch {
    return { error: "Failed to delete blog post." };
  }
}

export async function toggleBlogPublishAction(_prevState: ActionState, formData: FormData) {
  const authResult = await requireAdmin();
  if (authResult.error) return { error: authResult.error };

  const id = formData.get("id") as string;
  if (!id) return { error: "Missing record id." };

  try {
    const post = await db.blogPost.findUnique({ where: { id } });
    if (!post) return { error: "Post not found." };

    const publish = post.status !== "published";

    await db.blogPost.update({
      where: { id },
      data: {
        status: publish ? "published" : "draft",
        publishedAt: publish && !post.publishedAt ? new Date() : post.publishedAt,
      },
    });

    revalidatePath("/blog");
    revalidatePath(`${ADMIN_BASE_PATH}/blog`);
    revalidatePath(`/blog/${post.slug}`);

    return { success: true };
  } catch {
    return { error: "Failed to update publish status." };
  }
}

/** For use in server component forms (no useActionState). */
export async function toggleBlogPublishFormAction(formData: FormData) {
  await toggleBlogPublishAction(undefined, formData);
}
