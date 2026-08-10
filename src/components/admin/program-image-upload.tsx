"use client";

import { useRouter } from "next/navigation";
import { ImageUploadField } from "@/components/shared/image-upload-field";

type ProgramImageUploadProps = {
  programId: string;
  programTitle: string;
  currentUrl?: string | null;
};

export function ProgramImageUpload({
  programId,
  programTitle,
  currentUrl,
}: ProgramImageUploadProps) {
  const router = useRouter();

  return (
    <ImageUploadField
      name="imageUrl"
      label={`Photo for ${programTitle}`}
      endpoint="/api/admin/media/upload"
      defaultUrl={currentUrl}
      folder="alpha-fellowship/programs"
      targetType="program"
      targetId={programId}
      onUploaded={() => router.refresh()}
    />
  );
}
