"use client";

import { useActionState } from "react";
import { updateMemberProfileAction } from "@/lib/actions/member-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type MemberProfileFormProps = {
  profile: {
    name: string;
    email: string;
    phone: string;
    address: string;
    emergencyContact: string;
    emergencyPhone: string;
  };
};

export function MemberProfileForm({ profile }: MemberProfileFormProps) {
  const [state, formAction, pending] = useActionState(
    updateMemberProfileAction,
    undefined
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" defaultValue={profile.name} disabled />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={profile.email}
            disabled
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={profile.phone}
          placeholder="+256..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          name="address"
          rows={2}
          defaultValue={profile.address}
          placeholder="Kampala, Uganda"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="emergencyContact">Emergency contact name</Label>
          <Input
            id="emergencyContact"
            name="emergencyContact"
            defaultValue={profile.emergencyContact}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emergencyPhone">Emergency contact phone</Label>
          <Input
            id="emergencyPhone"
            name="emergencyPhone"
            type="tel"
            defaultValue={profile.emergencyPhone}
          />
        </div>
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.success && (
        <p className="text-sm text-primary">
          Profile saved. Database sync will activate in a later phase.
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
