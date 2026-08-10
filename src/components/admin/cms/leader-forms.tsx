"use client";

import { useActionState } from "react";
import {
  createLeaderAction,
  updateLeaderAction,
} from "@/lib/actions/content-cms";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CreateLeaderForm() {
  const [state, formAction, pending] = useActionState(createLeaderAction, undefined);

  if (state?.success) {
    return (
      <div className="rounded-2xl border border-border bg-white p-6 text-center">
        <p className="font-medium">Leader added. Refresh to add another.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-border bg-white p-6">
      <h2 className="type-subheading text-base">Add leader</h2>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="position">Position</Label>
        <Input id="position" name="position" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" name="bio" rows={4} />
      </div>
      <ImageUploadField
        name="photoUrl"
        label="Photo"
        endpoint="/api/admin/media/upload"
        folder="alpha-fellowship/leaders"
      />
      <div className="space-y-2">
        <Label htmlFor="sortOrder">Sort order</Label>
        <Input id="sortOrder" name="sortOrder" type="number" defaultValue={0} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="publishNow" defaultChecked />
        Publish on website
      </label>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} size="sm">
        {pending ? "Saving…" : "Add leader"}
      </Button>
    </form>
  );
}

type LeaderRecord = {
  id: string;
  name: string;
  position: string;
  bio: string | null;
  photoUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
};

export function EditLeaderForm({ leader }: { leader: LeaderRecord }) {
  const [state, formAction, pending] = useActionState(updateLeaderAction, undefined);

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
      <input type="hidden" name="id" value={leader.id} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Name</Label>
          <Input name="name" defaultValue={leader.name} required />
        </div>
        <div className="space-y-1">
          <Label>Position</Label>
          <Input name="position" defaultValue={leader.position} required />
        </div>
      </div>
      <div className="space-y-1">
        <Label>Bio</Label>
        <Textarea name="bio" rows={3} defaultValue={leader.bio ?? ""} />
      </div>
      <ImageUploadField
        name="photoUrl"
        label="Photo"
        endpoint="/api/admin/media/upload"
        folder="alpha-fellowship/leaders"
        defaultUrl={leader.photoUrl}
      />
      <div className="space-y-1">
        <Label>Sort order</Label>
        <Input name="sortOrder" type="number" defaultValue={leader.sortOrder} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isPublished" defaultChecked={leader.isPublished} />
        Published
      </label>
      {state?.success && <p className="text-sm text-green-600">Saved. Refresh to see updates.</p>}
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} size="sm">
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
