"use client";

import { useActionState } from "react";
import { submitVolunteerApplicationAction } from "@/lib/actions/volunteer";
import { HoneypotField } from "@/components/public/honeypot-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function VolunteerForm() {
  const [state, formAction, pending] = useActionState(
    submitVolunteerApplicationAction,
    undefined
  );

  if (state?.success) {
    return (
      <div className="rounded-2xl border border-border bg-white p-8 text-center">
        <h2 className="type-subheading mb-2">Application received</h2>
        <p className="type-body-sm text-muted-foreground">
          Thank you for your interest in serving. A team member will be in touch
          soon.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-border bg-white p-7 md:p-8 space-y-5"
    >
      <HoneypotField />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" name="phone" type="tel" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="areaOfInterest">Area of interest</Label>
          <Input
            id="areaOfInterest"
            name="areaOfInterest"
            placeholder="Worship, media, outreach…"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills">Skills & experience (optional)</Label>
        <Textarea id="skills" name="skills" rows={3} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="availability">Availability (optional)</Label>
        <Input
          id="availability"
          name="availability"
          placeholder="Weekends, weekday evenings…"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message (optional)</Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Tell us how you'd like to serve…"
        />
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Submitting…" : "Submit application"}
      </Button>
    </form>
  );
}
