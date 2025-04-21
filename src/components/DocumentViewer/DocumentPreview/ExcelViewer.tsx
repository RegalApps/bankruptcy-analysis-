
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Download, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface ExcelViewerProps {
  url: string;
  title?: string;
}

export const ExcelViewer: React.FC<ExcelViewerProps> = ({ url, title = "Excel Document" }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use Microsoft Office Online viewer or Google Sheets viewer
  const officeOnlineUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
  const googleSheetsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  
  // Use Office Online viewer by default
  const [viewerUrl, setViewerUrl] = useState(officeOnlineUrl);
  
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    // Reset to Microsoft viewer when URL changes
    setViewerUrl(officeOnlineUrl);
    
    // Simulate a timeout to detect if Office viewer fails to load
    const timeoutId = setTimeout(() => {
      // If still loading after 5 seconds, try Google viewer
      if (isLoading) {
        console.log("Office Online viewer timeout, switching to Google Sheets viewer");
        setViewerUrl(googleSheetsUrl);
      }
    }, 5000);
    
    return () => clearTimeout(timeoutId);
  }, [url, officeOnlineUrl, googleSheetsUrl]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setError("Failed to load Excel document");
    setIsLoading(false);
  };

  const handleOpenInNewTab = () => {
    window.open(url, "_blank");
    toast("Document opened in new tab");
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = title || "spreadsheet";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast("Download started");
  };

  const handleSwitchViewer = () => {
    // Toggle between Office Online and Google Sheets viewers
    setViewerUrl(viewerUrl === officeOnlineUrl ? googleSheetsUrl : officeOnlineUrl);
    setIsLoading(true);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p className="text-muted-foreground">Loading spreadsheet...</p>
          </div>
        </div>
      )}
      
      {error ? (
        <div className="flex flex-col items-center justify-center h-full p-6">
          <AlertCircle className="h-10 w-10 text-destructive mb-4" />
          <h3 className="text-lg font-medium mb-2">Failed to Load Spreadsheet</h3>
          <p className="text-muted-foreground mb-6">
            The file cannot be viewed in the browser. Try downloading it instead.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSwitchViewer}>
              Try Alternative Viewer
            </Button>
            <Button variant="outline" onClick={handleOpenInNewTab}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      ) : (
        <iframe
          src={viewerUrl}
          title={title}
          className="w-full h-full border-0"
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
};
