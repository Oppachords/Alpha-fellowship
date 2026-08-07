"use client";

import { useActionState } from "react";
import { updatePaymentMethodAction } from "@/lib/actions/payments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PaymentMethodDisplay } from "@/lib/payments/fallback-methods";

export function EditPaymentMethodForm({ method }: { method: PaymentMethodDisplay }) {
  const [state, formAction, pending] = useActionState(updatePaymentMethodAction, undefined);

  return (
    <form action={formAction} className="rounded-2xl border border-border bg-white p-5 space-y-4">
      <input type="hidden" name="id" value={method.id} />
      <h3 className="font-medium text-foreground">{method.displayName}</h3>

      {(method.type === "mtn" || method.type === "airtel") && (
        <>
          <div className="space-y-2">
            <Label htmlFor={`phone-${method.id}`}>Phone number</Label>
            <Input
              id={`phone-${method.id}`}
              name="phoneNumber"
              defaultValue={method.phoneNumber ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`merchant-${method.id}`}>Merchant code</Label>
            <Input
              id={`merchant-${method.id}`}
              name="merchantCode"
              defaultValue={method.merchantCode ?? ""}
            />
          </div>
        </>
      )}

      {method.type === "bank" && (
        <div className="space-y-2">
          <Label htmlFor={`account-${method.id}`}>Account number</Label>
          <Input
            id={`account-${method.id}`}
            name="accountNumber"
            defaultValue={method.accountNumber ?? ""}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor={`instructions-${method.id}`}>Instructions</Label>
        <Textarea
          id={`instructions-${method.id}`}
          name="instructions"
          rows={2}
          defaultValue={method.instructions ?? ""}
        />
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.success && <p className="text-sm text-primary">Saved.</p>}

      <Button type="submit" disabled={pending} size="sm">
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
