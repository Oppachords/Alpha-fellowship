"use client";

import { useActionState } from "react";
import { createServiceAction } from "@/lib/actions/church-content-admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const days = [
  { value: "0", label: "Sunday" },
  { value: "2", label: "Tuesday" },
  { value: "1", label: "Monday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" },
];

export function CreateServiceForm() {
  const [state, formAction, pending] = useActionState(createServiceAction, undefined);

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-border bg-white p-6">
      <h3 className="font-medium text-foreground">Add gathering</h3>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required placeholder="Sunday Service" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dayOfWeek">Day</Label>
        <select
          id="dayOfWeek"
          name="dayOfWeek"
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          defaultValue="0"
        >
          {days.map((day) => (
            <option key={day.value} value={day.value}>
              {day.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start time</Label>
          <Input id="startTime" name="startTime" type="time" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">End time</Label>
          <Input id="endTime" name="endTime" type="time" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="venue">Venue</Label>
        <Input id="venue" name="venue" placeholder="Grace Gardens Namungoona" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={3} />
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.success && <p className="text-sm text-primary">Gathering saved.</p>}

      <Button type="submit" disabled={pending} size="sm">
        {pending ? "Saving…" : "Add gathering"}
      </Button>
    </form>
  );
}
