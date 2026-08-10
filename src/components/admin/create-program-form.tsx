"use client";

import { useActionState } from "react";
import { createProgramAction } from "@/lib/actions/church-content-admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CreateProgramForm() {
  const [state, formAction, pending] = useActionState(createProgramAction, undefined);

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-border bg-white p-6">
      <h3 className="font-medium text-foreground">Add program</h3>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required placeholder="Weekly Fellowship" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={3} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="schedule">Schedule (optional)</Label>
        <Input id="schedule" name="schedule" placeholder="Every Sunday" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location (optional)</Label>
        <Input id="location" name="location" placeholder="Grace Gardens Namungoona" />
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.success && <p className="text-sm text-primary">Program saved.</p>}

      <Button type="submit" disabled={pending} size="sm">
        {pending ? "Saving…" : "Add program"}
      </Button>
    </form>
  );
}
