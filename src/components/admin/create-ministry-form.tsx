"use client";

import { useActionState } from "react";
import { createMinistryAction } from "@/lib/actions/church-operations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CreateMinistryForm() {
  const [state, formAction, pending] = useActionState(createMinistryAction, undefined);

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-border bg-white p-6">
      <h2 className="type-subheading text-base">Add ministry</h2>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={3} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="schedule">Schedule</Label>
          <Input id="schedule" name="schedule" placeholder="Every Sunday..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" />
        </div>
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.success && <p className="text-sm text-primary">Ministry created.</p>}
      <Button type="submit" disabled={pending} size="sm">
        {pending ? "Saving…" : "Create ministry"}
      </Button>
    </form>
  );
}
