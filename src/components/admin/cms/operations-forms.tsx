"use client";

import { useActionState } from "react";
import {
  updateEventAction,
  updateMinistryAction,
  updateCampaignAction,
} from "@/lib/actions/church-crud";
import {
  updateProgramAction,
  updateServiceAction,
} from "@/lib/actions/church-content-admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function EditEventForm({
  event,
}: {
  event: {
    id: string;
    title: string;
    description: string | null;
    startDate: Date;
    venue: string | null;
    speaker: string | null;
    isPublished: boolean;
  };
}) {
  const [state, formAction, pending] = useActionState(updateEventAction, undefined);
  const dateValue = event.startDate.toISOString().slice(0, 16);

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
      <input type="hidden" name="id" value={event.id} />
      <Input name="title" defaultValue={event.title} required />
      <Textarea name="description" rows={2} defaultValue={event.description ?? ""} />
      <Input name="startDate" type="datetime-local" defaultValue={dateValue} required />
      <Input name="venue" defaultValue={event.venue ?? ""} placeholder="Venue" />
      <Input name="speaker" defaultValue={event.speaker ?? ""} placeholder="Speaker" />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isPublished" defaultChecked={event.isPublished} />
        Published
      </label>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} size="sm">
        Save event
      </Button>
    </form>
  );
}

export function EditMinistryForm({
  ministry,
}: {
  ministry: {
    id: string;
    name: string;
    description: string | null;
    schedule: string | null;
    location: string | null;
    isPublished: boolean;
  };
}) {
  const [state, formAction, pending] = useActionState(updateMinistryAction, undefined);

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
      <input type="hidden" name="id" value={ministry.id} />
      <Input name="name" defaultValue={ministry.name} required />
      <Textarea name="description" rows={2} defaultValue={ministry.description ?? ""} />
      <Input name="schedule" defaultValue={ministry.schedule ?? ""} />
      <Input name="location" defaultValue={ministry.location ?? ""} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isPublished" defaultChecked={ministry.isPublished} />
        Published
      </label>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} size="sm">
        Save ministry
      </Button>
    </form>
  );
}

export function EditProgramForm({
  program,
}: {
  program: {
    id: string;
    title: string;
    description: string | null;
    schedule: string | null;
    location: string | null;
    isPublished: boolean;
  };
}) {
  const [state, formAction, pending] = useActionState(updateProgramAction, undefined);

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
      <input type="hidden" name="id" value={program.id} />
      <Input name="title" defaultValue={program.title} required />
      <Textarea name="description" rows={2} defaultValue={program.description ?? ""} />
      <Input name="schedule" defaultValue={program.schedule ?? ""} />
      <Input name="location" defaultValue={program.location ?? ""} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isPublished" defaultChecked={program.isPublished} />
        Published
      </label>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} size="sm">
        Save program
      </Button>
    </form>
  );
}

export function EditServiceForm({
  service,
}: {
  service: {
    id: string;
    name: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string | null;
    venue: string | null;
    description: string | null;
    isActive: boolean;
  };
}) {
  const [state, formAction, pending] = useActionState(updateServiceAction, undefined);

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
      <input type="hidden" name="id" value={service.id} />
      <Input name="name" defaultValue={service.name} required />
      <div className="space-y-1">
        <Label>Day of week (0=Sun)</Label>
        <Input name="dayOfWeek" type="number" min={0} max={6} defaultValue={service.dayOfWeek} />
      </div>
      <Input name="startTime" defaultValue={service.startTime} placeholder="HH:MM" required />
      <Input name="endTime" defaultValue={service.endTime ?? ""} placeholder="End HH:MM" />
      <Input name="venue" defaultValue={service.venue ?? ""} />
      <Textarea name="description" rows={2} defaultValue={service.description ?? ""} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isActive" defaultChecked={service.isActive} />
        Active
      </label>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} size="sm">
        Save service
      </Button>
    </form>
  );
}

export function EditCampaignForm({
  campaign,
}: {
  campaign: {
    id: string;
    title: string;
    description: string | null;
    goalAmount: unknown;
    isPublished: boolean;
  };
}) {
  const [state, formAction, pending] = useActionState(updateCampaignAction, undefined);
  const goal =
    campaign.goalAmount != null ? String(campaign.goalAmount) : "";

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
      <input type="hidden" name="id" value={campaign.id} />
      <Input name="title" defaultValue={campaign.title} required />
      <Textarea name="description" rows={2} defaultValue={campaign.description ?? ""} />
      <Input name="goalAmount" type="number" step="0.01" defaultValue={goal} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isPublished" defaultChecked={campaign.isPublished} />
        Published
      </label>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} size="sm">
        Save campaign
      </Button>
    </form>
  );
}
