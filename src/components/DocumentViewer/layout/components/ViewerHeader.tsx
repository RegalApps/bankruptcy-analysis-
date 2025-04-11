
import React from "react";
import { Button } from "@/components/ui/button";
import { MenuIcon, Users, Clock, ChevronLeft, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    <div className="border-b bg-white dark:bg-background p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {(isTablet || isMobile) && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="h-8 w-8"
          >
            <MenuIcon className="h-4 w-4" />
          </Button>
        )}
        
        <div>
          <h2 className="font-medium text-lg line-clamp-1">{documentTitle}</h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <span>{documentType}</span>
            {isForm47 && <Badge variant="secondary" className="text-xs">Form 47</Badge>}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs hidden sm:flex items-center gap-1"
        >
          <Download className="h-3 w-3 mr-1" />
          Download
        </Button>
        
        {(isTablet || isMobile) ? (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleCollaborationPanel}
            className="h-8 w-8"
          >
            <Users className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs flex items-center gap-1"
            >
              <Users className="h-3 w-3 mr-1" />
              Share
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs flex items-center gap-1"
            >
              <Clock className="h-3 w-3 mr-1" />
              History
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
