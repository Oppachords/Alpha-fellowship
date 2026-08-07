"use client";

import { useActionState } from "react";
import { submitCounsellingRequestAction } from "@/lib/actions/pastoral-care";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type CounsellingRequestFormProps = {
  defaults: {
    name: string;
    email: string;
    phone: string;
  };
};

export function CounsellingRequestForm({ defaults }: CounsellingRequestFormProps) {
  const [state, formAction, pending] = useActionState(
    submitCounsellingRequestAction,
    undefined
  );

  if (state?.success) {
    return (
      <div className="rounded-2xl border border-border bg-white p-8 text-center">
        <h2 className="type-subheading mb-2">Request received</h2>
        <p className="type-body-sm text-muted-foreground">
          A pastoral leader will review your counselling request and contact you
          to arrange a suitable time.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-border bg-white p-7 md:p-8 space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required defaultValue={defaults.name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={defaults.email}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={defaults.phone}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="preferredContact">Preferred contact</Label>
          <Input
            id="preferredContact"
            name="preferredContact"
            placeholder="Phone, email, WhatsApp..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferredDateTime">Preferred date / time (optional)</Label>
        <Input
          id="preferredDateTime"
          name="preferredDateTime"
          placeholder="e.g. Weekday evenings"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Reason for counselling (optional)</Label>
        <Input
          id="reason"
          name="reason"
          placeholder="Brief summary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Additional details (optional)</Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Anything you'd like the pastoral team to know..."
        />
      </div>

      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" name="hasConsent" required className="mt-1" />
        <span>I consent to a pastoral leader contacting me about this request</span>
      </label>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Submitting…" : "Request counselling"}
      </Button>
    </form>
  );
}
