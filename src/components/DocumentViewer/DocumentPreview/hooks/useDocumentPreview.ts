
import { useState, useRef, RefObject } from "react";
import { toast } from "sonner";

export const useDocumentPreview = (fileUrl: string | null, title: string, providedIframeRef?: RefObject<HTMLIFrameElement>) => {
  const [isLoading, setIsLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [useDirectLink, setUseDirectLink] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const localIframeRef = useRef<HTMLIFrameElement>(null);
  
  // Use the provided ref or fallback to local ref
  const activeIframeRef = providedIframeRef || localIframeRef;

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
      // Create a temporary anchor and simulate click to download
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

  const handlePrint = () => {
    try {
      if (activeIframeRef.current) {
        // Try using the iframe's print function
        activeIframeRef.current.contentWindow?.print();
      } else if (fileUrl) {
        // Fallback: open in new window and print
        const printWindow = window.open(fileUrl, '_blank');
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.print();
          };
        }
      }
      toast.info("Print dialog opened");
    } catch (error) {
      console.error("Print error:", error);
      toast.error("Failed to print document");
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
    iframeRef: activeIframeRef,
    handleZoomIn,
    handleZoomOut,
    handleOpenInNewTab,
    handleDownload,
    handlePrint
  };
};
