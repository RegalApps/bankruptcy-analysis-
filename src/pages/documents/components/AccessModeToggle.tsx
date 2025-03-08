
import React from "react";
import { Lock, UnlockKeyhole } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface AccessModeToggleProps {
  hasWriteAccess: boolean;
  onToggle: () => void;
}

export const AccessModeToggle = ({
  hasWriteAccess,
  onToggle,
}: AccessModeToggleProps) => {
  return (
    <div className="flex items-center gap-2">
      {hasWriteAccess ? (
        <UnlockKeyhole className="h-4 w-4 text-green-500" />
      ) : (
        <Lock className="h-4 w-4 text-amber-500" />
      )}
      <span className="text-sm mr-2">
        {hasWriteAccess ? "Edit Mode" : "View-Only Mode"}
      </span>
      <Switch checked={hasWriteAccess} onCheckedChange={onToggle} />
    </div>
  );
};
