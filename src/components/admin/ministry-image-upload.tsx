"use client";

import { useRouter } from "next/navigation";
import { ImageUploadField } from "@/components/shared/image-upload-field";

type MinistryImageUploadProps = {
  ministryId: string;
  ministryName: string;
  currentUrl?: string | null;
};

export function MinistryImageUpload({
  ministryId,
  ministryName,
  currentUrl,
}: MinistryImageUploadProps) {
  const router = useRouter();

  return (
    <ImageUploadField
      name="imageUrl"
      label={`Photo for ${ministryName}`}
      endpoint="/api/admin/media/upload"
      defaultUrl={currentUrl}
      folder="alpha-fellowship/ministries"
      targetType="ministry"
      targetId={ministryId}
      onUploaded={() => router.refresh()}
    />
  );
}
