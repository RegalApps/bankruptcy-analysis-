
import React, { useState, useEffect } from "react";
import { Risk } from "@/utils/documents/types/analysisTypes";
import { RiskHighlightOverlay } from "./RiskHighlightOverlay";
import { ViewerToolbar } from "./ViewerToolbar";

interface PDFViewerProps {
  fileUrl: string;
  activeRiskId?: string | null;
  onRiskSelect?: (id: string) => void;
  risks?: Risk[];
  documentId?: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  fileUrl,
  activeRiskId,
  onRiskSelect,
  risks = [],
  documentId
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Reset current page when file URL changes
  useEffect(() => {
    setCurrentPage(1);
  }, [fileUrl]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Define handlers for toolbar
  const handleZoomIn = () => {
    setZoomLevel(prev => prev + 10);
    setScale(prev => prev + 0.1);
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => prev - 10);
    setScale(prev => Math.max(prev - 0.1, 0.1));
  };

  const handleRefresh = () => {
    // Refresh logic
  };

  const handleOpenInNewTab = () => {
    window.open(fileUrl, '_blank');
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "document.pdf";
    link.click();
  };

  const handlePrint = () => {
    const printWindow = window.open(fileUrl, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ViewerToolbar 
        title="PDF Document"
        zoomLevel={zoomLevel}
        numPages={numPages} 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        scale={scale}
        setScale={setScale}
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onRefresh={handleRefresh}
        onOpenInNewTab={handleOpenInNewTab}
        onDownload={handleDownload}
        onPrint={handlePrint}
      />
      
      <div className="flex-1 overflow-auto relative bg-muted/20">
        <iframe 
          src={`${fileUrl}#page=${currentPage}&zoom=${scale * 100}`}
          className="w-full h-full border-0"
          title="PDF Viewer"
        />
        
        {risks && risks.length > 0 && (
          <RiskHighlightOverlay 
            risks={risks}
            documentWidth={800}
            documentHeight={1100}
            activeRiskId={activeRiskId || null}
            onRiskClick={(risk) => onRiskSelect?.(risk.type)}
            containerRef={{ current: null }}
            currentPage={currentPage}
          />
        )}
      </div>
    </div>
  );
};
