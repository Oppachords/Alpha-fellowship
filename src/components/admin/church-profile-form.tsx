"use client";

import { useActionState } from "react";
import { updateChurchProfileAction } from "@/lib/actions/church-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ChurchProfileFormProps = {
  profile: {
    name: string;
    tagline: string;
    mission: string;
    vision: string;
    story: string;
  };
};

export function ChurchProfileForm({ profile }: ChurchProfileFormProps) {
  const [state, formAction, pending] = useActionState(
    updateChurchProfileAction,
    undefined
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="name">Church name</Label>
          <Input id="name" name="name" defaultValue={profile.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input id="tagline" name="tagline" defaultValue={profile.tagline} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mission">Mission</Label>
        <Textarea id="mission" name="mission" rows={3} defaultValue={profile.mission} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="vision">Vision</Label>
        <Textarea id="vision" name="vision" rows={3} defaultValue={profile.vision} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="story">Our story</Label>
        <Textarea id="story" name="story" rows={8} defaultValue={profile.story} />
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.success && (
        <p className="text-sm text-primary">Settings saved successfully.</p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
