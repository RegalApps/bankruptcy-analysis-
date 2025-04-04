
import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download, Printer, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";
import { ViewerToolbarProps } from "../types";

export const ViewerToolbar: React.FC<ViewerToolbarProps> = ({
  title,
  zoomLevel,
  isRetrying,
  onZoomIn,
  onZoomOut,
  onRefresh,
  onOpenInNewTab,
  onDownload,
  onPrint
}) => {
  return (
    <div className="py-2 px-4 border-b flex items-center justify-between bg-card">
      <div className="flex items-center">
        <h3 className="text-sm font-medium mr-4">{title}</h3>
        <span className="text-xs text-muted-foreground">{zoomLevel}%</span>
      </div>
      
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onZoomOut}
          className="h-8 w-8"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onZoomIn}
          className="h-8 w-8"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onRefresh}
          className={`h-8 w-8 ${isRetrying ? 'animate-spin' : ''}`}
          title="Refresh"
          disabled={isRetrying}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenInNewTab}
          className="h-8 w-8"
          title="Open in New Tab"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onDownload}
          className="h-8 w-8"
          title="Download"
        >
          <Download className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrint}
          className="h-8 w-8"
          title="Print"
        >
          <Printer className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
