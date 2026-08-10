"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ActionState } from "@/lib/actions/admin-helpers";

type DeleteRecordButtonProps = {
  id: string;
  label?: string;
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  confirmMessage?: string;
};

export function DeleteRecordButton({
  id,
  label = "Delete",
  action,
  confirmMessage = "Delete this item? This cannot be undone.",
}: DeleteRecordButtonProps) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        disabled={pending}
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-3.5 w-3.5 mr-1" />
        {pending ? "Deleting…" : label}
      </Button>
      {state?.error && (
        <p className="text-xs text-destructive mt-1">{state.error}</p>
      )}
    </form>
  );
}
