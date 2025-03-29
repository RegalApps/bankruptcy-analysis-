
import { Document } from "@/components/DocumentList/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StatusIndicatorProps {
  document: Document;
}

export const StatusIndicator = ({ document }: StatusIndicatorProps) => {
  const status = document.metadata?.status || 'pending';
  
  switch (status) {
    case 'approved':
      return <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Approved / No Risks</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>;
    case 'pending':
      return <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Pending / Minor Issues</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>;
    case 'attention':
      return <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Requires Attention</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>;
    case 'critical':
      return <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Critical Compliance Risks</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>;
    default:
      return <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          </TooltipTrigger>
          <TooltipContent>
            <p>No Status</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>;
  }
};
