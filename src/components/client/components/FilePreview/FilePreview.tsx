
import { Document } from "../../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Eye, Download, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface FilePreviewProps {
  document: Document;
  onDocumentOpen: () => void;
}

export const FilePreview = ({ document, onDocumentOpen }: FilePreviewProps) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const { toast } = useToast();
  
  const handleZoomIn = () => {
    if (zoomLevel < 200) {
      setZoomLevel(prevZoom => prevZoom + 25);
    }
  };
  
  const handleZoomOut = () => {
    if (zoomLevel > 50) {
      setZoomLevel(prevZoom => prevZoom - 25);
    }
  };
  
  const handleDownload = () => {
    // This would be replaced with an actual download implementation
    toast({
      title: "Download started",
      description: `Downloading ${document.title}...`,
    });
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-2 flex items-center justify-between bg-muted/30">
        <div className="flex items-center space-x-1">
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm px-2">{zoomLevel}%</span>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          <Button variant="default" size="sm" onClick={onDocumentOpen}>
            <Eye className="h-4 w-4 mr-1" />
            Open
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 flex items-center justify-center min-h-[200px]">
          {document.url ? (
            // In a real implementation, you'd use a proper document viewer here
            <iframe 
              src={document.url} 
              className="w-full h-[500px] border rounded"
              title={document.title}
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center top' }}
            />
          ) : (
            <div className="text-center p-6 bg-muted rounded-lg">
              <RotateCw className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground mb-2">
                Preview not available for this document.
              </p>
              <Button size="sm" onClick={onDocumentOpen}>
                Open in document viewer
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
