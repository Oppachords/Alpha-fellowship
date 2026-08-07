"use client";

import { useTransition } from "react";
import { verifyPaymentConfirmationAction } from "@/lib/actions/payments";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function VerifyPaymentButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  function handleVerify() {
    startTransition(async () => {
      const result = await verifyPaymentConfirmationAction(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Payment marked as verified.");
      }
    });
  }

  return (
    <Button onClick={handleVerify} disabled={pending} size="sm" variant="outline">
      {pending ? "Verifying…" : "Mark verified"}
    </Button>
  );
}
