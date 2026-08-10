"use client";

import { useActionState } from "react";
import {
  createGalleryAction,
  updateGalleryAction,
  addGalleryItemAction,
} from "@/lib/actions/content-cms";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CreateGalleryForm() {
  const [state, formAction, pending] = useActionState(createGalleryAction, undefined);

  if (state?.success) {
    return (
      <div className="rounded-2xl border border-border bg-white p-6 text-center">
        <p className="font-medium">Gallery created. Refresh to add another.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-border bg-white p-6">
      <h2 className="type-subheading text-base">New gallery</h2>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={3} />
      </div>
      <ImageUploadField
        name="coverImage"
        label="Cover image"
        endpoint="/api/admin/media/upload"
        folder="alpha-fellowship/gallery"
      />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="publishNow" defaultChecked />
        Publish on website
      </label>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} size="sm">
        {pending ? "Saving…" : "Create gallery"}
      </Button>
    </form>
  );
}

type GalleryRecord = {
  id: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  isPublished: boolean;
};

export function EditGalleryForm({ gallery }: { gallery: GalleryRecord }) {
  const [state, formAction, pending] = useActionState(updateGalleryAction, undefined);

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
      <input type="hidden" name="id" value={gallery.id} />
      <div className="space-y-1">
        <Label>Title</Label>
        <Input name="title" defaultValue={gallery.title} required />
      </div>
      <div className="space-y-1">
        <Label>Description</Label>
        <Textarea name="description" rows={2} defaultValue={gallery.description ?? ""} />
      </div>
      <ImageUploadField
        name="coverImage"
        label="Cover image"
        endpoint="/api/admin/media/upload"
        folder="alpha-fellowship/gallery"
        defaultUrl={gallery.coverImage}
      />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isPublished" defaultChecked={gallery.isPublished} />
        Published
      </label>
      {state?.success && <p className="text-sm text-green-600">Saved.</p>}
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} size="sm">
        Save gallery
      </Button>
    </form>
  );
}

export function AddGalleryItemForm({ galleryId }: { galleryId: string }) {
  const [state, formAction, pending] = useActionState(addGalleryItemAction, undefined);

  if (state?.success) {
    return <p className="text-sm text-green-600">Image added. Refresh to add another.</p>;
  }

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-dashed border-border p-4 mt-3">
      <input type="hidden" name="galleryId" value={galleryId} />
      <p className="text-sm font-medium">Add photo to gallery</p>
      <ImageUploadField
        name="imageUrl"
        label="Photo"
        endpoint="/api/admin/media/upload"
        folder="alpha-fellowship/gallery"
      />
      <div className="space-y-1">
        <Label>Caption (optional)</Label>
        <Input name="caption" />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} size="sm" variant="outline">
        Add photo
      </Button>
    </form>
  );
}
