"use client";

import { useActionState } from "react";
import { registerMemberAction } from "@/lib/actions/membership";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MEMBER_LOGIN_PATH } from "@/lib/constants/member";

export function MemberRegistrationForm() {
  const [state, formAction, pending] = useActionState(
    registerMemberAction,
    undefined
  );

  if (state?.success) {
    return (
      <div className="rounded-2xl border border-border bg-white p-8 text-center">
        <h2 className="type-subheading mb-2">Registration submitted</h2>
        <p className="type-body-sm text-muted-foreground mb-6">
          Thank you for registering. An administrator will review your application.
          You&apos;ll receive access to sign in once your account is approved.
        </p>
        <Link href={MEMBER_LOGIN_PATH} className="pill-btn-outline inline-flex">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-border bg-white p-7 md:p-8 space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" required placeholder="Your name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" type="tel" placeholder="+256..." />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="At least 8 characters"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Tell us about yourself (optional)</Label>
        <Textarea
          id="message"
          name="message"
          rows={3}
          placeholder="Why would you like to join Alpha Fellowship?"
        />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Submitting…" : "Create account"}
      </Button>
    </form>
  );
}
