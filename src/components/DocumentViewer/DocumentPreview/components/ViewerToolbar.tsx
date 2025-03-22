
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, RefreshCw, ZoomIn, ZoomOut, Printer } from "lucide-react";

interface ViewerToolbarProps {
  title: string;
  zoomLevel: number;
  isRetrying: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRefresh: () => void;
  onOpenInNewTab: () => void;
  onDownload: () => void;
  onPrint: () => void;
}

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
    <div className="bg-muted/30 p-2 flex justify-between items-center border-b">
      <div className="flex items-center gap-2">
        <button 
          onClick={onZoomOut} 
          className="p-1 hover:bg-muted rounded-md"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <span className="text-xs font-mono">{zoomLevel}%</span>
        <button 
          onClick={onZoomIn} 
          className="p-1 hover:bg-muted rounded-md"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={onOpenInNewTab}
          className="text-xs flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-muted/50 rounded-md border"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open
        </button>
        <button 
          onClick={onRefresh}
          disabled={isRetrying}
          className="text-xs flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-muted/50 rounded-md border"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
        <button 
          onClick={onDownload}
          className="text-xs flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-muted/50 rounded-md border"
        >
          <Download className="h-3.5 w-3.5" />
          Download
        </button>
        <button 
          onClick={onPrint}
          className="text-xs flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-muted/50 rounded-md border"
        >
          <Printer className="h-3.5 w-3.5" />
          Print
        </button>
      </div>
    </div>
  );
};
