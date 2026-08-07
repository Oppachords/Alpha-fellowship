"use client";

import { useActionState } from "react";
import { submitMembershipApplicationAction } from "@/lib/actions/membership";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function MembershipApplicationForm() {
  const [state, formAction, pending] = useActionState(
    submitMembershipApplicationAction,
    undefined
  );

  if (state?.success) {
    return (
      <div className="rounded-2xl border border-border bg-white p-8 text-center">
        <h2 className="type-subheading mb-2">Application received</h2>
        <p className="type-body-sm text-muted-foreground">
          Thank you for your interest in joining Alpha Fellowship. A leader will
          be in touch with you soon.
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
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" required placeholder="Your name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" type="tel" placeholder="+256..." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Tell us about yourself (optional)</Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Why would you like to join Alpha Fellowship?"
        />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Submitting…" : "Submit application"}
      </Button>
    </form>
  );
}
