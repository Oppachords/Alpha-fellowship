import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasAdminRole } from "@/lib/auth/permissions";
import { uploadImage, isCloudinaryConfigured } from "@/lib/integrations/cloudinary";
import { createAuditLog } from "@/lib/security/audit-log";
import { IMAGE_UPLOAD } from "@/lib/media/constants";
import { db } from "@/lib/db";

async function validateServerImage(file: File) {
  if (!(IMAGE_UPLOAD.allowedMimeTypes as readonly string[]).includes(file.type)) {
    return "Please upload a JPEG, WebP, or PNG image.";
  }

  if (file.size > IMAGE_UPLOAD.maxBytes) {
    return `Image must be under ${IMAGE_UPLOAD.maxLabel}.`;
  }

  return null;
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || !hasAdminRole(session.user.roles)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Cloudinary is not configured. Add credentials to environment variables." },
      { status: 503 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const validationError = await validateServerImage(file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const altText = (formData.get("altText") as string | null)?.trim() || null;
    const folder = (formData.get("folder") as string | null)?.trim() || "alpha-fellowship";
    const targetType = (formData.get("targetType") as string | null)?.trim();
    const targetId = (formData.get("targetId") as string | null)?.trim();

    const upload = await uploadImage(buffer, file.name, folder);

    const media = await db.media.create({
      data: {
        filename: upload.publicId.split("/").pop() ?? file.name,
        originalName: file.name,
        url: upload.url,
        cloudinaryId: upload.publicId,
        mimeType: file.type,
        size: upload.bytes ?? file.size,
        width: upload.width,
        height: upload.height,
        altText,
        folder,
        uploadedBy: session.user.id,
      },
    });

    if (targetType && targetId) {
      switch (targetType) {
        case "ministry":
          await db.ministry.update({
            where: { id: targetId },
            data: { imageUrl: upload.url },
          });
          break;
        case "program":
          await db.program.update({
            where: { id: targetId },
            data: { imageUrl: upload.url },
          });
          break;
        case "leader":
          await db.leader.update({
            where: { id: targetId },
            data: { photoUrl: upload.url },
          });
          break;
        case "campaign":
          await db.campaign.update({
            where: { id: targetId },
            data: { coverImage: upload.url },
          });
          break;
        case "site_setting":
          await db.siteSetting.upsert({
            where: { key: targetId },
            update: { value: upload.url },
            create: {
              key: targetId,
              value: upload.url,
              group: "images",
              type: "image",
              label: targetId,
            },
          });
          break;
        default:
          break;
      }
    }

    await createAuditLog({
      userId: session.user.id,
      action: "upload",
      resource: "media",
      resourceId: media.id,
      details: { filename: file.name, targetType, targetId },
    });

    return NextResponse.json({ url: upload.url, media });
  } catch (error) {
    console.error("Media upload failed:", error);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
