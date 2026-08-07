"use client";

import { useActionState } from "react";
import { submitPaymentConfirmationAction } from "@/lib/actions/payments";
import type { PaymentMethodDisplay } from "@/lib/payments/fallback-methods";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HoneypotField } from "@/components/public/honeypot-field";

const purposes = [
  { value: "tithe", label: "Tithe" },
  { value: "offering", label: "Offering" },
  { value: "campaign", label: "Campaign / Outreach" },
  { value: "other", label: "Other" },
];

type PaymentConfirmationFormProps = {
  methods: PaymentMethodDisplay[];
};

export function PaymentConfirmationForm({ methods }: PaymentConfirmationFormProps) {
  const [state, formAction, pending] = useActionState(
    submitPaymentConfirmationAction,
    undefined
  );

  if (state?.success) {
    return (
      <div className="rounded-2xl border border-border bg-white p-8 text-center">
        <h2 className="type-subheading mb-2">Thank you for giving</h2>
        <p className="type-body-sm text-muted-foreground">
          Your payment confirmation has been received. Our team will verify it
          shortly and reach out if needed.
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
      <div>
        <h2 className="type-subheading mb-1">Confirm your gift</h2>
        <p className="type-body-sm text-muted-foreground">
          After sending via mobile money or bank transfer, submit your details
          so we can acknowledge your giving.
        </p>
      </div>

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
          <Label htmlFor="amount">Amount (UGX, optional)</Label>
          <Input id="amount" name="amount" type="number" min="0" step="1" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Payment method</Label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            required
            className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm"
          >
            <option value="">Select method</option>
            {methods.map((method) => (
              <option key={method.id} value={method.type}>
                {method.displayName}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="purpose">Purpose</Label>
          <select
            id="purpose"
            name="purpose"
            className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm"
          >
            {purposes.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="referenceNumber">Transaction reference</Label>
        <Input
          id="referenceNumber"
          name="referenceNumber"
          required
          placeholder="Mobile money or bank reference number"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Note (optional)</Label>
        <Textarea id="message" name="message" rows={3} />
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Submitting…" : "Submit confirmation"}
      </Button>
    </form>
  );
}
