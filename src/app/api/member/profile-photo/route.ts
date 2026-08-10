import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadImage, isCloudinaryConfigured } from "@/lib/integrations/cloudinary";
import { IMAGE_UPLOAD } from "@/lib/media/constants";

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
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Cloudinary is not configured." },
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

    const folder = (formData.get("folder") as string | null)?.trim() || "alpha-fellowship/members";
    const buffer = Buffer.from(await file.arrayBuffer());
    const upload = await uploadImage(buffer, file.name, folder);

    return NextResponse.json({ url: upload.url, media: upload });
  } catch (error) {
    console.error("Member photo upload failed:", error);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
