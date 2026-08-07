"use client";

import { useActionState } from "react";
import { createCampaignAction } from "@/lib/actions/church-operations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CreateCampaignForm() {
  const [state, formAction, pending] = useActionState(createCampaignAction, undefined);

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-border bg-white p-6">
      <h2 className="type-subheading text-base">Add campaign</h2>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={3} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="goalAmount">Goal amount (UGX, optional)</Label>
        <Input id="goalAmount" name="goalAmount" type="number" min="0" step="1" />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.success && <p className="text-sm text-primary">Campaign created.</p>}
      <Button type="submit" disabled={pending} size="sm">
        {pending ? "Saving…" : "Create campaign"}
      </Button>
    </form>
  );
}
