"use client";

import { useState } from "react";
import { toast } from "sonner";
import { IMAGE_UPLOAD } from "@/lib/media/constants";
import { validateImageUpload } from "@/lib/media/validate-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ImageUploadFieldProps = {
  name: string;
  label?: string;
  endpoint: string;
  defaultUrl?: string | null;
  folder?: string;
  targetType?: string;
  targetId?: string;
  multiple?: boolean;
  maxFiles?: number;
  onUploaded?: (url: string | string[]) => void;
};

export function ImageUploadField({
  name,
  label = "Photo",
  endpoint,
  defaultUrl,
  folder = "alpha-fellowship",
  targetType,
  targetId,
  multiple = false,
  maxFiles = 10,
  onUploaded,
}: ImageUploadFieldProps) {
  const initialUrls = defaultUrl ? [defaultUrl] : [];
  const [previewUrls, setPreviewUrls] = useState<string[]>(initialUrls);
  const [hiddenValues, setHiddenValues] = useState<string[]>(initialUrls);
  const [pending, setPending] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const selectedFiles = multiple ? files.slice(0, maxFiles) : files.slice(0, 1);
    const validations = await Promise.all(
      selectedFiles.map(async (file) => ({
        file,
        validation: await validateImageUpload(file),
      }))
    );

    for (const result of validations) {
      if (!result.validation.ok) {
        toast.error(result.validation.error);
        e.target.value = "";
        return;
      }
    }

    setPending(true);
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("file", file);
    });
    formData.append("folder", folder);
    if (targetType) formData.append("targetType", targetType);
    if (targetId) formData.append("targetId", targetId);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error ?? "Upload failed.");
        return;
      }

      const uploadedUrls = (Array.isArray(data.urls) ? data.urls : [data.url]).filter(Boolean) as string[];
      if (!uploadedUrls.length) {
        toast.error("No image URL returned.");
        return;
      }

      const nextUrls = multiple ? uploadedUrls : uploadedUrls.slice(0, 1);
      setPreviewUrls(nextUrls);
      setHiddenValues(nextUrls);
      onUploaded?.(multiple ? nextUrls : nextUrls[0]);
      toast.success(multiple ? `${nextUrls.length} images uploaded.` : "Image uploaded.");
      if (!multiple) {
        e.target.value = "";
      }
    } catch {
      toast.error("Upload failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={`${name}-file`}>{label}</Label>
      <p className="text-xs text-muted-foreground">{IMAGE_UPLOAD.helperText}</p>

      {previewUrls.length > 0 ? (
        multiple ? (
          <div className="grid grid-cols-3 gap-2 max-w-xs">
            {previewUrls.slice(0, 6).map((url, index) => (
              <div key={`${url}-${index}`} className="relative h-20 overflow-hidden rounded-lg border border-border bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
            {previewUrls.length > 6 && (
              <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-border bg-muted text-xs font-medium text-muted-foreground">
                +{previewUrls.length - 6}
              </div>
            )}
          </div>
        ) : (
          <div className="relative h-36 w-full max-w-xs overflow-hidden rounded-xl border border-border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrls[0]} alt="" className="h-full w-full object-cover" />
          </div>
        )
      ) : (
        <div className="flex h-36 w-full max-w-xs items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 text-xs text-muted-foreground">
          No photo yet
        </div>
      )}

      <Input
        id={`${name}-file`}
        type="file"
        accept={IMAGE_UPLOAD.allowedMimeTypes.join(",")}
        multiple={multiple}
        disabled={pending}
        onChange={handleFileChange}
      />
      {hiddenValues.map((url, index) => (
        <input key={`${name}-${index}`} type="hidden" name={name} value={url} />
      ))}
      {pending && (
        <Button type="button" disabled size="sm" variant="outline">
          Uploading…
        </Button>
      )}
    </div>
  );
}
