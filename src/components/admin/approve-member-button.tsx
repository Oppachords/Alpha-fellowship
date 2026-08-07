"use client";

import { useTransition } from "react";
import { approveMemberAction } from "@/lib/actions/member-approval";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ApproveMemberButton({ userId }: { userId: string }) {
  const [pending, startTransition] = useTransition();

  function handleApprove() {
    startTransition(async () => {
      const result = await approveMemberAction(userId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Member approved. They can now sign in.");
      }
    });
  }

  return (
    <Button onClick={handleApprove} disabled={pending} size="sm">
      {pending ? "Approving…" : "Approve"}
    </Button>
  );
}
