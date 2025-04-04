
import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";

export const useDocumentPreview = (fileUrl: string | null, title: string) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [useDirectLink, setUseDirectLink] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleZoomIn = useCallback(() => {
    setZoomLevel(prevZoom => Math.min(prevZoom + 10, 200));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prevZoom => Math.max(prevZoom - 10, 50));
  }, []);

  const handleOpenInNewTab = useCallback(() => {
    if (fileUrl) {
      window.open(fileUrl, "_blank", "noreferrer");
      toast.success("Document opened in new tab");
    } else {
      toast.error("Document URL not available");
    }
  }, [fileUrl]);

  const handleDownload = useCallback(() => {
    if (fileUrl) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.setAttribute("download", `${title || "document"}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Download started");
    } else {
      toast.error("Download link not available");
    }
  }, [fileUrl, title]);

  const handlePrint = useCallback(() => {
    // If we have an iframe reference, print its content
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.print();
      } catch (err) {
        console.error("Error printing iframe content:", err);
        // Fallback to direct URL printing
        if (fileUrl) {
          const printWindow = window.open(fileUrl, "_blank");
          if (printWindow) {
            printWindow.addEventListener("load", () => {
              printWindow.print();
            });
          } else {
            toast.error("Pop-up blocked. Please allow pop-ups to print.");
          }
        } else {
          toast.error("Print function not available");
        }
      }
    } else if (fileUrl) {
      // Direct URL printing fallback
      const printWindow = window.open(fileUrl, "_blank");
      if (printWindow) {
        printWindow.addEventListener("load", () => {
          printWindow.print();
        });
      } else {
        toast.error("Pop-up blocked. Please allow pop-ups to print.");
      }
    } else {
      toast.error("Print function not available");
    }
  }, [fileUrl, iframeRef]);

  return {
    zoomLevel,
    useDirectLink,
    isRetrying,
    iframeRef,
    handleZoomIn,
    handleZoomOut,
    handleOpenInNewTab,
    handleDownload,
    handlePrint,
    setIsLoading
  };
};
