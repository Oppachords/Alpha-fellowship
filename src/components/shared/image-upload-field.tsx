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
  onUploaded?: (url: string) => void;
};

export function ImageUploadField({
  name,
  label = "Photo",
  endpoint,
  defaultUrl,
  folder = "alpha-fellowship",
  targetType,
  targetId,
  onUploaded,
}: ImageUploadFieldProps) {
  const [preview, setPreview] = useState(defaultUrl ?? "");
  const [hiddenValue, setHiddenValue] = useState(defaultUrl ?? "");
  const [pending, setPending] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = await validateImageUpload(file);
    if (!validation.ok) {
      toast.error(validation.error);
      e.target.value = "";
      return;
    }

    setPending(true);
    const formData = new FormData();
    formData.append("file", file);
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

      const url = data.url as string;
      setPreview(url);
      setHiddenValue(url);
      onUploaded?.(url);
      toast.success("Image uploaded.");
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

      {preview ? (
        <div className="relative h-36 w-full max-w-xs overflow-hidden rounded-xl border border-border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="" className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="flex h-36 w-full max-w-xs items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 text-xs text-muted-foreground">
          No photo yet
        </div>
      )}

      <Input
        id={`${name}-file`}
        type="file"
        accept={IMAGE_UPLOAD.allowedMimeTypes.join(",")}
        disabled={pending}
        onChange={handleFileChange}
      />
      <input type="hidden" name={name} value={hiddenValue} />
      {pending && (
        <Button type="button" disabled size="sm" variant="outline">
          Uploading…
        </Button>
      )}
    </div>
  );
}
