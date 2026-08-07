"use client";

import { useActionState } from "react";
import { createEventAction } from "@/lib/actions/church-operations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CreateEventForm() {
  const [state, formAction, pending] = useActionState(createEventAction, undefined);

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-border bg-white p-6">
      <h2 className="type-subheading text-base">Add event</h2>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="startDate">Start date</Label>
        <Input id="startDate" name="startDate" type="date" required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="venue">Venue</Label>
          <Input id="venue" name="venue" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="speaker">Speaker</Label>
          <Input id="speaker" name="speaker" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={3} />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.success && <p className="text-sm text-primary">Event created.</p>}
      <Button type="submit" disabled={pending} size="sm">
        {pending ? "Saving…" : "Create event"}
      </Button>
    </form>
  );
}
