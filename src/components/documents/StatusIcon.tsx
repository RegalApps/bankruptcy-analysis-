
import { CircleCheck, CircleAlert, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

// Export the type so it can be used by other components
export type DocumentStatus = "needs-review" | "complete" | "needs-signature" | undefined;

interface StatusIconProps {
  status: DocumentStatus;
  className?: string;
}

export const StatusIcon = ({ status, className }: StatusIconProps) => {
  switch (status) {
    case "complete":
      return (
        <div className="flex items-center">
          <CircleCheck className={cn("h-4 w-4 text-green-500", className)} />
        </div>
      );
    case "needs-review":
      return (
        <div className="flex items-center">
          <Pencil className={cn("h-4 w-4 text-amber-500", className)} />
        </div>
      );
    case "needs-signature":
      return (
        <div className="flex items-center">
          <CircleAlert className={cn("h-4 w-4 text-red-500", className)} />
        </div>
      );
    default:
      return null;
  }
};
