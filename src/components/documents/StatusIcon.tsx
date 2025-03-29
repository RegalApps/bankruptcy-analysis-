
import { AlertCircle, CheckCircle, XCircle, LockClosedIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type DocumentStatus = 'approved' | 'needs-review' | 'non-compliant' | 'locked' | 'none';

interface StatusIconProps {
  status: DocumentStatus;
  className?: string;
  showTooltip?: boolean;
}

export const StatusIcon = ({ status, className, showTooltip = true }: StatusIconProps) => {
  const getIcon = () => {
    switch (status) {
      case 'approved':
        return <CheckCircle className={cn("h-4 w-4 text-green-500", className)} />;
      case 'needs-review':
        return <AlertCircle className={cn("h-4 w-4 text-orange-500", className)} />;
      case 'non-compliant':
        return <XCircle className={cn("h-4 w-4 text-red-500", className)} />;
      case 'locked':
        return <LockClosedIcon className={cn("h-4 w-4 text-gray-500", className)} />;
      default:
        return null;
    }
  };
  
  const getTooltipText = () => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'needs-review':
        return 'Needs Review';
      case 'non-compliant':
        return 'Non-Compliant';
      case 'locked':
        return 'Locked (Signed or Filed)';
      default:
        return '';
    }
  };
  
  const icon = getIcon();
  
  if (!icon || !showTooltip) return icon;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{icon}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
