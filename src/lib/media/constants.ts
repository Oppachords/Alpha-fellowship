export const IMAGE_UPLOAD = {
  maxBytes: 6 * 1024 * 1024,
  maxLabel: "6 MB",
  minWidth: 200,
  minHeight: 200,
  allowedMimeTypes: ["image/jpeg", "image/jpg", "image/webp", "image/png"],
  allowedExtensions: [".jpg", ".jpeg", ".webp", ".png"],
  helperText:
    "Use JPEG or WebP when possible. Maximum 6 MB. Minimum 200×200 pixels.",
} as const;

export function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
