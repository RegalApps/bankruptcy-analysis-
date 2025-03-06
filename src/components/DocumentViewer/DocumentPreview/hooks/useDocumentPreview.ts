
import { useState, useRef } from "react";
import { toast } from "sonner";

export const useDocumentPreview = (fileUrl: string | null, title: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [useDirectLink, setUseDirectLink] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 200));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 50));
  };

  const handleOpenInNewTab = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
      toast.info("Document opened in new tab");
    }
  };

  const handleDownload = async () => {
    if (!fileUrl) return;
    
    try {
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = title || 'document';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success("Download started");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download document");
    }
  };

  return {
    isLoading,
    setIsLoading,
    zoomLevel,
    useDirectLink,
    setUseDirectLink,
    isRetrying,
    setIsRetrying,
    iframeRef,
    handleZoomIn,
    handleZoomOut,
    handleOpenInNewTab,
    handleDownload
  };
};
