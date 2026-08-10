import { IMAGE_UPLOAD } from "@/lib/media/constants";

export type ImageValidationResult =
  | { ok: true }
  | { ok: false; error: string };

export function validateImageFile(file: File): ImageValidationResult {
  if (!(IMAGE_UPLOAD.allowedMimeTypes as readonly string[]).includes(file.type)) {
    return {
      ok: false,
      error: "Please upload a JPEG, WebP, or PNG image.",
    };
  }

  if (file.size > IMAGE_UPLOAD.maxBytes) {
    return {
      ok: false,
      error: `Image must be under ${IMAGE_UPLOAD.maxLabel}.`,
    };
  }

  return { ok: true };
}

export async function validateImageDimensions(
  file: File
): Promise<ImageValidationResult> {
  if (typeof window === "undefined") {
    return { ok: true };
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const dimensions = await new Promise<{ width: number; height: number }>(
      (resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = () => reject(new Error("Invalid image"));
        img.src = objectUrl;
      }
    );

    if (
      dimensions.width < IMAGE_UPLOAD.minWidth ||
      dimensions.height < IMAGE_UPLOAD.minHeight
    ) {
      return {
        ok: false,
        error: `Image must be at least ${IMAGE_UPLOAD.minWidth}×${IMAGE_UPLOAD.minHeight} pixels.`,
      };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Could not read image dimensions." };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function validateImageUpload(file: File): Promise<ImageValidationResult> {
  const basic = validateImageFile(file);
  if (!basic.ok) return basic;
  return validateImageDimensions(file);
}
