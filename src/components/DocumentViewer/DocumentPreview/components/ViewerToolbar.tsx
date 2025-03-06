
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";

interface ViewerToolbarProps {
  title: string;
  zoomLevel: number;
  isRetrying: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRefresh: () => void;
  onOpenInNewTab: () => void;
  onDownload: () => void;
}

export const ViewerToolbar: React.FC<ViewerToolbarProps> = ({
  title,
  zoomLevel,
  isRetrying,
  onZoomIn,
  onZoomOut,
  onRefresh,
  onOpenInNewTab,
  onDownload
}) => {
  return (
    <div className="bg-muted/50 p-2 flex justify-between items-center border-b">
      <span className="text-sm font-medium truncate flex-1">{title}</span>
      <div className="flex gap-2">
        <div className="flex items-center gap-1 mr-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={onZoomOut}
            className="h-7 w-7"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <span className="text-xs font-mono">{zoomLevel}%</span>
          <Button 
            variant="outline" 
            size="icon"
            onClick={onZoomIn}
            className="h-7 w-7"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onOpenInNewTab}
          className="h-7"
        >
          <ExternalLink className="h-3.5 w-3.5 mr-1" />
          Open
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRefresh}
          disabled={isRetrying}
          className="h-7"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1" />
          Refresh
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onDownload}
          className="h-7"
        >
          <Download className="h-3.5 w-3.5 mr-1" />
          Download
        </Button>
      </div>
    </div>
  );
};
