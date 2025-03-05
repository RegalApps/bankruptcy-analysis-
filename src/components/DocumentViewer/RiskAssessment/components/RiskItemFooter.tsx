
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CreateTaskButton } from '../CreateTaskButton';
import { Risk } from "../types";

interface RiskItemFooterProps {
  risk: Risk;
  documentId: string;
}

export const RiskItemFooter = ({ risk, documentId }: RiskItemFooterProps) => {
  return (
    <div className="flex gap-2 justify-end">
      <Tooltip>
        <TooltipTrigger asChild>
          <CreateTaskButton 
            risk={risk} 
            documentId={documentId} 
          />
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Create a task from this risk</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
