"use client";

import { useActionState } from "react";
import {
  createSermonAction,
  updateSermonAction,
  createTestimonialAction,
  updateTestimonialAction,
  createFaqAction,
  updateFaqAction,
  createAnnouncementAction,
  updateAnnouncementAction,
} from "@/lib/actions/content-cms";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CreateSermonForm() {
  const [state, formAction, pending] = useActionState(createSermonAction, undefined);
  if (state?.success) {
    return (
      <div className="rounded-2xl border border-border bg-white p-6 text-center">
        <p className="font-medium">Sermon added. Refresh to add another.</p>
      </div>
    );
  }
  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-border bg-white p-6">
      <h2 className="type-subheading text-base">Add sermon</h2>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input name="title" required />
      </div>
      <div className="space-y-2">
        <Label>Speaker</Label>
        <Input name="speaker" />
      </div>
      <div className="space-y-2">
        <Label>YouTube URL or video ID</Label>
        <Input name="youtubeUrl" placeholder="https://youtube.com/watch?v=..." />
      </div>
      <div className="space-y-2">
        <Label>Sermon date</Label>
        <Input name="sermonDate" type="date" />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea name="description" rows={3} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="publishNow" defaultChecked />
        Publish on website
      </label>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} size="sm">
        Add sermon
      </Button>
    </form>
  );
}

type SermonRecord = {
  id: string;
  title: string;
  speaker: string | null;
  youtubeUrl: string | null;
  sermonDate: Date | null;
  description: string | null;
  isPublished: boolean;
};

export function EditSermonForm({ sermon }: { sermon: SermonRecord }) {
  const [state, formAction, pending] = useActionState(updateSermonAction, undefined);
  const dateValue = sermon.sermonDate
    ? sermon.sermonDate.toISOString().slice(0, 10)
    : "";

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
      <input type="hidden" name="id" value={sermon.id} />
      <Input name="title" defaultValue={sermon.title} required />
      <Input name="speaker" defaultValue={sermon.speaker ?? ""} placeholder="Speaker" />
      <Input name="youtubeUrl" defaultValue={sermon.youtubeUrl ?? ""} placeholder="YouTube URL" />
      <Input name="sermonDate" type="date" defaultValue={dateValue} />
      <Textarea name="description" rows={2} defaultValue={sermon.description ?? ""} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isPublished" defaultChecked={sermon.isPublished} />
        Published
      </label>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} size="sm">
        Save sermon
      </Button>
    </form>
  );
}

export function CreateTestimonialForm() {
  const [state, formAction, pending] = useActionState(createTestimonialAction, undefined);
  if (state?.success) {
    return (
      <div className="rounded-2xl border border-border bg-white p-6 text-center">
        <p className="font-medium">Testimonial added.</p>
      </div>
    );
  }
  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-border bg-white p-6">
      <h2 className="type-subheading text-base">Add testimonial</h2>
      <Input name="name" required placeholder="Name" />
      <Textarea name="content" rows={4} required placeholder="Testimonial" />
      <ImageUploadField name="photoUrl" endpoint="/api/admin/media/upload" folder="alpha-fellowship/testimonials" />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="hasConsent" required />
        Person has given consent
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="publishNow" />
        Publish
      </label>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} size="sm">
        Add testimonial
      </Button>
    </form>
  );
}

type TestimonialRecord = {
  id: string;
  name: string;
  content: string;
  photoUrl: string | null;
  hasConsent: boolean;
  isPublished: boolean;
};

export function EditTestimonialForm({ item }: { item: TestimonialRecord }) {
  const [state, formAction, pending] = useActionState(updateTestimonialAction, undefined);
  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
      <input type="hidden" name="id" value={item.id} />
      <Input name="name" defaultValue={item.name} required />
      <Textarea name="content" rows={3} defaultValue={item.content} required />
      <ImageUploadField name="photoUrl" endpoint="/api/admin/media/upload" folder="alpha-fellowship/testimonials" defaultUrl={item.photoUrl} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="hasConsent" defaultChecked={item.hasConsent} />
        Has consent
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isPublished" defaultChecked={item.isPublished} />
        Published
      </label>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} size="sm">
        Save
      </Button>
    </form>
  );
}

export function CreateFaqForm() {
  const [state, formAction, pending] = useActionState(createFaqAction, undefined);
  if (state?.success) {
    return (
      <div className="rounded-2xl border border-border bg-white p-6 text-center">
        <p className="font-medium">FAQ added.</p>
      </div>
    );
  }
  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-border bg-white p-6">
      <h2 className="type-subheading text-base">Add FAQ</h2>
      <Input name="question" required placeholder="Question" />
      <Textarea name="answer" rows={4} required placeholder="Answer" />
      <Input name="category" placeholder="Category (optional)" />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="publishNow" defaultChecked />
        Publish
      </label>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} size="sm">
        Add FAQ
      </Button>
    </form>
  );
}

type FaqRecord = {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  isPublished: boolean;
};

export function EditFaqForm({ faq }: { faq: FaqRecord }) {
  const [state, formAction, pending] = useActionState(updateFaqAction, undefined);
  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
      <input type="hidden" name="id" value={faq.id} />
      <Input name="question" defaultValue={faq.question} required />
      <Textarea name="answer" rows={3} defaultValue={faq.answer} required />
      <Input name="category" defaultValue={faq.category ?? ""} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isPublished" defaultChecked={faq.isPublished} />
        Published
      </label>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} size="sm">
        Save FAQ
      </Button>
    </form>
  );
}

export function CreateAnnouncementForm() {
  const [state, formAction, pending] = useActionState(createAnnouncementAction, undefined);
  if (state?.success) {
    return (
      <div className="rounded-2xl border border-border bg-white p-6 text-center">
        <p className="font-medium">Announcement created.</p>
      </div>
    );
  }
  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-border bg-white p-6">
      <h2 className="type-subheading text-base">New announcement</h2>
      <Input name="title" required placeholder="Title" />
      <Textarea name="content" rows={4} required placeholder="Content" />
      <Input name="type" defaultValue="general" placeholder="Type" />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="publishNow" defaultChecked />
        Publish
      </label>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} size="sm">
        Create
      </Button>
    </form>
  );
}

type AnnouncementRecord = {
  id: string;
  title: string;
  content: string;
  type: string;
  isPublished: boolean;
};

export function EditAnnouncementForm({ item }: { item: AnnouncementRecord }) {
  const [state, formAction, pending] = useActionState(updateAnnouncementAction, undefined);
  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
      <input type="hidden" name="id" value={item.id} />
      <Input name="title" defaultValue={item.title} required />
      <Textarea name="content" rows={3} defaultValue={item.content} required />
      <Input name="type" defaultValue={item.type} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isPublished" defaultChecked={item.isPublished} />
        Published
      </label>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} size="sm">
        Save
      </Button>
    </form>
  );
}
