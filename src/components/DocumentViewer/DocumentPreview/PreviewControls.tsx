
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, FileSearch, ExternalLink } from "lucide-react";

interface PreviewControlsProps {
  url: string | null;
  title: string;
  isAnalyzing: boolean;
  onAnalyzeClick: () => void;
}

export const PreviewControls: React.FC<PreviewControlsProps> = ({ 
  url, 
  title,
  isAnalyzing,
  onAnalyzeClick
}) => {
  const handleDownload = () => {
    if (!url) return;
    
    const link = document.createElement('a');
    link.href = url;
    link.download = title || 'document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-sm">
      <Button
        variant="default" 
        size="sm"
        onClick={onAnalyzeClick}
        disabled={isAnalyzing}
        className="gap-2"
      >
        <FileSearch className="h-4 w-4" />
        {isAnalyzing ? "Analyzing..." : "Analyze Document"}
      </Button>
      
      {url && (
        <>
          <Button
            variant="outline" 
            size="sm"
            asChild
            className="gap-2"
          >
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
              Open
            </a>
          </Button>
          
          <Button
            variant="ghost" 
            size="sm"
            onClick={handleDownload}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </>
      )}
    </div>
  );
};
