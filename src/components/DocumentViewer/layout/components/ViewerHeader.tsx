
import React from "react";
import { FileBarChart, FileText } from "lucide-react";

interface ViewerHeaderProps {
  documentTitle: string;
  documentType: string;
  isForm47: boolean;
  isTablet: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
  toggleCollaborationPanel: () => void;
}

export const ViewerHeader: React.FC<ViewerHeaderProps> = ({
  documentTitle,
  documentType,
  isForm47,
  isTablet,
  isMobile,
  toggleSidebar,
  toggleCollaborationPanel,
}) => {
  return (
    <div className="sticky top-0 z-10 flex justify-between items-center p-2 sm:p-3 bg-muted/30 border-b">
      <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
        <div className="bg-muted/50 p-1.5 sm:p-2 rounded-md flex-shrink-0">
          {isForm47 ? (
            <FileBarChart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          ) : (
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          )}
        </div>
        <div className="flex flex-col overflow-hidden">
          <h1 className="text-sm sm:text-lg font-bold text-foreground truncate">{documentTitle}</h1>
          <div className="flex flex-wrap gap-1 sm:gap-2 mt-0.5 sm:mt-1">
            {isForm47 && (
              <div className="bg-primary/10 text-primary px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
                Consumer Proposal
              </div>
            )}
            <div className="bg-muted text-muted-foreground px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
              Form {documentType.includes('47') ? '47' : documentType}
            </div>
          </div>
        </div>
      </div>
      
      {(isMobile || isTablet) && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSidebar}
            className="h-8 px-2"
          >
            {isTablet && !isMobile ? "Document Details" : "Details"}
          </Button>
          <Button
            variant="outline"
            size="sm" 
            onClick={toggleCollaborationPanel}
            className="h-8 px-2"
          >
            {isTablet && !isMobile ? "Collaboration" : "Comments"}
          </Button>
        </div>
      )}
    </div>
  );
};

import { Button } from "@/components/ui/button";
