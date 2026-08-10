"use client";

import { useActionState } from "react";
import { createMemberByAdminAction } from "@/lib/actions/admin-account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateMemberForm() {
  const [state, formAction, pending] = useActionState(
    createMemberByAdminAction,
    undefined
  );

  if (state?.success) {
    return (
      <div className="rounded-2xl border border-border bg-white p-5 text-center">
        <p className="font-medium text-foreground mb-1">Member created</p>
        <p className="text-sm text-muted-foreground">
          The new member account is ready. Refresh to create another.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-border bg-white p-5 space-y-4"
    >
      <div>
        <h3 className="font-medium text-foreground mb-1">Create member</h3>
        <p className="text-xs text-muted-foreground">
          Manually add a member account for approval or immediate access.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" required placeholder="Member name" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="member@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input id="phone" name="phone" type="tel" placeholder="+256..." />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Temporary password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" name="activateNow" className="rounded border-border" />
        Activate immediately (skip approval queue)
      </label>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending} size="sm" className="w-full">
        {pending ? "Creating…" : "Create member"}
      </Button>
    </form>
  );
}
