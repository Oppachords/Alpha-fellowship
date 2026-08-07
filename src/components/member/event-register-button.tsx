"use client";

import { useActionState } from "react";
import { registerForEventAction } from "@/lib/actions/church-operations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type EventRegisterButtonProps = {
  eventId: string;
  eventTitle: string;
  defaults: { name: string; email: string; phone: string };
};

export function EventRegisterButton({
  eventId,
  eventTitle,
  defaults,
}: EventRegisterButtonProps) {
  const [state, formAction, pending] = useActionState(registerForEventAction, undefined);

  if (state?.success) {
    return (
      <p className="text-sm text-primary mt-3">Registered for {eventTitle}.</p>
    );
  }

  return (
    <form action={formAction} className="mt-4 pt-4 border-t border-border space-y-3">
      <input type="hidden" name="eventId" value={eventId} />
      <input type="hidden" name="name" value={defaults.name} />
      <input type="hidden" name="email" value={defaults.email} />
      <input type="hidden" name="phone" value={defaults.phone} />
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} size="sm">
        {pending ? "Registering…" : "Register for this event"}
      </Button>
    </form>
  );
}
