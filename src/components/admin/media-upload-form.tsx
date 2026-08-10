"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IMAGE_UPLOAD } from "@/lib/media/constants";
import { validateImageUpload } from "@/lib/media/validate-image";

export function MediaUploadForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    const formData = new FormData(e.currentTarget);
    const file = formData.get("file");

    if (file instanceof File) {
      const validation = await validateImageUpload(file);
      if (!validation.ok) {
        toast.error(validation.error);
        setPending(false);
        return;
      }
    }

    try {
      const response = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error ?? "Upload failed.");
        return;
      }

      toast.success("Image uploaded.");
      formRef.current?.reset();
      router.refresh();
    } catch {
      toast.error("Upload failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-white p-5 space-y-4"
    >
      <h3 className="font-medium text-foreground">Upload image</h3>
      <p className="text-xs text-muted-foreground">{IMAGE_UPLOAD.helperText}</p>

      <div className="space-y-2">
        <Label htmlFor="file">Image file</Label>
        <Input
          id="file"
          name="file"
          type="file"
          accept={IMAGE_UPLOAD.allowedMimeTypes.join(",")}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="altText">Alt text (optional)</Label>
        <Input id="altText" name="altText" placeholder="Describe the image" />
      </div>

      <Button type="submit" disabled={pending} size="sm">
        {pending ? "Uploading…" : "Upload to Cloudinary"}
      </Button>
    </form>
  );
}
