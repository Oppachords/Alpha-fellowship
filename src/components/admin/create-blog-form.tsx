"use client";

import { useActionState } from "react";
import { createBlogPostAction } from "@/lib/actions/blog-admin";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CreateBlogForm() {
  const [state, formAction, pending] = useActionState(createBlogPostAction, undefined);

  if (state?.success) {
    return (
      <div className="rounded-2xl border border-border bg-white p-6 text-center">
        <p className="font-medium text-foreground mb-1">Blog post saved</p>
        <p className="text-sm text-muted-foreground">Refresh to write another post.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-border bg-white p-6">
      <div>
        <h2 className="type-subheading text-base">Write a blog post</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Admins and pastors can publish messages, updates, and reflections.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required placeholder="Post title" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Short summary (optional)</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          placeholder="A brief preview shown on the blog listing"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          rows={10}
          required
          placeholder="Write your message here. Separate paragraphs with blank lines."
        />
      </div>

      <ImageUploadField
        name="featuredImage"
        label="Featured photo (optional)"
        endpoint="/api/admin/media/upload"
        folder="alpha-fellowship/blog"
      />

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" name="publishNow" className="rounded border-border" />
        Publish immediately (leave unchecked to save as draft)
      </label>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending} size="sm">
        {pending ? "Saving…" : "Save post"}
      </Button>
    </form>
  );
}
