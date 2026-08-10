"use client";

import { useActionState } from "react";
import { updateBlogPostAction } from "@/lib/actions/blog-admin";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type BlogPostRecord = {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  featuredImage: string | null;
  status: string;
};

export function EditBlogForm({ post }: { post: BlogPostRecord }) {
  const [state, formAction, pending] = useActionState(updateBlogPostAction, undefined);

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
      <input type="hidden" name="id" value={post.id} />
      <div className="space-y-1">
        <Label>Title</Label>
        <Input name="title" defaultValue={post.title} required />
      </div>
      <div className="space-y-1">
        <Label>Excerpt</Label>
        <Textarea name="excerpt" rows={2} defaultValue={post.excerpt ?? ""} />
      </div>
      <div className="space-y-1">
        <Label>Content</Label>
        <Textarea name="content" rows={8} defaultValue={post.content ?? ""} required />
      </div>
      <ImageUploadField
        name="featuredImage"
        label="Featured photo"
        endpoint="/api/admin/media/upload"
        folder="alpha-fellowship/blog"
        defaultUrl={post.featuredImage}
      />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="publishNow" defaultChecked={post.status === "published"} />
        Published
      </label>
      {state?.success && <p className="text-sm text-green-600">Saved.</p>}
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} size="sm">
        {pending ? "Saving…" : "Save post"}
      </Button>
    </form>
  );
}
