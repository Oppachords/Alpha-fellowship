import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasAdminRole } from "@/lib/auth/permissions";
import { uploadImage, isCloudinaryConfigured } from "@/lib/integrations/cloudinary";
import { db } from "@/lib/db";

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

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image uploads are supported." }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File must be under 5 MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const altText = (formData.get("altText") as string | null)?.trim() || null;
    const folder = (formData.get("folder") as string | null)?.trim() || "alpha-fellowship";

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

    return NextResponse.json({ media });
  } catch (error) {
    console.error("Media upload failed:", error);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
