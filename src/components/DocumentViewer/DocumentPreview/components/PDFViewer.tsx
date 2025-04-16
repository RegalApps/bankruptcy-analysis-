
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

  return (
    <div className="flex flex-col h-full">
      <ViewerToolbar 
        numPages={numPages} 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        scale={scale}
        setScale={setScale}
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
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
            currentPage={currentPage}
            activeRiskId={activeRiskId}
            onRiskSelect={onRiskSelect}
          />
        )}
      </div>
    </div>
  );
};
