
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FolderStatusIndicatorProps {
  status?: string;
}

export const FolderStatusIndicator = ({ status }: FolderStatusIndicatorProps) => {
  if (!status) return null;
  
  switch (status) {
    case 'approved':
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Approved / No Risks</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    case 'pending':
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Pending / Minor Issues</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    case 'attention':
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Requires Attention</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    case 'critical':
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Critical Compliance Risks</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    default:
      return null;
  }
};
