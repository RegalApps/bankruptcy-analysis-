
import React from "react";
import { Button } from "@/components/ui/button";
import { RotateCw, ExternalLink } from "lucide-react";
import { PreviewControlsProps } from "./types";

export const PreviewControls: React.FC<PreviewControlsProps> = ({ 
  publicUrl, 
  onRefresh 
}) => {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline" 
        size="sm"
        onClick={onRefresh}
        title="Refresh preview"
      >
        <RotateCw className="h-4 w-4 mr-2" />
        Refresh
      </Button>
      <Button
        variant="default" 
        size="sm"
        asChild
      >
        <a 
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm flex items-center"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Open Document
        </a>
      </Button>
    </div>
  );
};
