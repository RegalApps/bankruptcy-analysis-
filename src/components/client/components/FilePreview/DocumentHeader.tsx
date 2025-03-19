
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Document } from "../../types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DocumentHeaderProps {
  document: Document;
  handleDocumentOpen: () => void;
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  document,
  handleDocumentOpen,
}) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-1 truncate">{document.title}</h3>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date(document.updated_at).toLocaleDateString()}
        </p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="sm" 
                onClick={handleDocumentOpen}
                className="gap-1"
              >
                <Eye className="h-4 w-4" />
                <span>Open</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Open document in viewer (or double-click document in list)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
