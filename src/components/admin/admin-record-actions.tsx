"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

type AdminRecordActionsProps = {
  editForm: React.ReactNode;
  deleteButton: React.ReactNode;
};

export function AdminRecordActions({ editForm, deleteButton }: AdminRecordActionsProps) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="mt-4 pt-4 border-t border-border">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setEditing((v) => !v)}
        >
          <Pencil className="h-3.5 w-3.5 mr-1" />
          {editing ? "Cancel edit" : "Edit"}
        </Button>
        {deleteButton}
      </div>
      {editing && <div className="mt-4">{editForm}</div>}
    </div>
  );
}
