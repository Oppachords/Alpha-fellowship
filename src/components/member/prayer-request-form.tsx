"use client";

import { useActionState } from "react";
import { submitPrayerRequestAction } from "@/lib/actions/pastoral-care";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type PrayerRequestFormProps = {
  defaults: {
    name: string;
    email: string;
    phone: string;
  };
};

const categories = [
  { value: "personal", label: "Personal" },
  { value: "family", label: "Family" },
  { value: "health", label: "Health" },
  { value: "thanksgiving", label: "Thanksgiving" },
  { value: "other", label: "Other" },
];

export function PrayerRequestForm({ defaults }: PrayerRequestFormProps) {
  const [state, formAction, pending] = useActionState(
    submitPrayerRequestAction,
    undefined
  );

  if (state?.success) {
    return (
      <div className="rounded-2xl border border-border bg-white p-8 text-center">
        <h2 className="type-subheading mb-2">Prayer request received</h2>
        <p className="type-body-sm text-muted-foreground">
          Our pastoral team will be praying with you. A leader may reach out if
          you requested follow-up.
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
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={defaults.phone}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            defaultValue="personal"
            className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="request">Prayer request</Label>
        <Textarea
          id="request"
          name="request"
          required
          rows={5}
          placeholder="Share what you'd like us to pray for..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferredContact">Preferred contact method (optional)</Label>
        <Input
          id="preferredContact"
          name="preferredContact"
          placeholder="Phone, email, WhatsApp..."
        />
      </div>

      <div className="space-y-3">
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" name="isAnonymous" className="mt-1" />
          <span>Submit anonymously (your name will not be shared with the prayer team)</span>
        </label>
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" name="hasConsent" required className="mt-1" />
          <span>I consent to a pastoral leader contacting me about this request</span>
        </label>
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Submitting…" : "Submit prayer request"}
      </Button>
    </form>
  );
}
