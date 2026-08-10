import { NextResponse } from "next/server";
import { uploadImage, isCloudinaryConfigured } from "@/lib/integrations/cloudinary";
import { guardPublicForm } from "@/lib/security/public-form-guard";
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
  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Photo upload is not available yet." },
      { status: 503 }
    );
  }

  try {
    const formData = await request.formData();

    const guard = await guardPublicForm(formData, {
      scope: "member-photo",
      limit: 5,
      windowMs: 60 * 60 * 1000,
    });
    if (guard?.honeypot) {
      return NextResponse.json({ url: "" });
    }
    if (guard?.error) {
      return NextResponse.json({ error: guard.error }, { status: 429 });
    }

    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const validationError = await validateServerImage(file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const upload = await uploadImage(
      buffer,
      file.name,
      "alpha-fellowship/members/pending"
    );

    return NextResponse.json({ url: upload.url });
  } catch (error) {
    console.error("Registration photo upload failed:", error);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
