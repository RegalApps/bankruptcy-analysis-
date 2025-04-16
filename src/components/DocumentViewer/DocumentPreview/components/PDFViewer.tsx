
import React, { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PDFViewerProps, Risk } from "../types";
import { RiskHighlighter } from "./RiskHighlighter";

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export const PDFViewer: React.FC<PDFViewerProps> = ({
  fileUrl,
  activeRiskId,
  onRiskSelect,
  risks = []
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Function to go to next page
  const nextPage = () => {
    if (numPages && pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  // Function to go to previous page
  const prevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  // Handle document load success
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
    setLoadError(null);
    // Reset to page 1 when loading a new document
    setPageNumber(1);
  };

  // Handle document load error
  const onDocumentLoadError = (error: Error) => {
    console.error("Error loading PDF:", error);
    setIsLoading(false);
    setLoadError(error);
  };

  // Update page based on active risk
  useEffect(() => {
    if (activeRiskId && risks && risks.length > 0) {
      const selectedRisk = risks.find(risk => risk.id === activeRiskId);
      if (selectedRisk && selectedRisk.position?.page) {
        setPageNumber(selectedRisk.position.page);
      }
    }
  }, [activeRiskId, risks]);

  // Get risks for current page only
  const currentPageRisks = risks
    ? risks.filter(risk => 
        risk.position && 
        (risk.position.page === pageNumber || 
         (risk.position.page === undefined && pageNumber === 1))
      )
    : [];

  // Render a loading state
  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted/20">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Loading document...</p>
        </div>
      </div>
    );
  }

  // Render an error state
  if (loadError) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted/20">
        <div className="text-center max-w-sm p-6 border rounded-lg bg-destructive/10">
          <h3 className="text-lg font-medium mb-2">Error Loading Document</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {loadError.message || "The document could not be loaded. It may be corrupted or in an unsupported format."}
          </p>
          <div className="text-xs text-muted-foreground mt-4">
            <p>File URL: {fileUrl ? "Provided" : "Not provided"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" ref={containerRef}>
      {/* PDF Navigation */}
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={prevPage} 
            disabled={pageNumber <= 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm mx-2">
            Page {pageNumber} of {numPages || "?"}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={nextPage} 
            disabled={!numPages || pageNumber >= numPages}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setScale(scale => Math.max(0.5, scale - 0.1))}
            className="h-8 w-8 p-0"
          >
            -
          </Button>
          <span className="text-xs mx-2">{Math.round(scale * 100)}%</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setScale(scale => Math.min(2, scale + 0.1))}
            className="h-8 w-8 p-0"
          >
            +
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setScale(1.0)}
            className="text-xs ml-1"
          >
            Reset
          </Button>
        </div>
      </div>
      
      {/* PDF Document */}
      <div className="flex-1 overflow-auto bg-zinc-100 p-4 flex justify-center">
        <div className="relative">
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex items-center justify-center h-[500px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
          >
            <div className="relative shadow-lg">
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
              
              {/* Risk Highlighters */}
              {currentPageRisks.map((risk, index) => (
                <RiskHighlighter
                  key={`risk-${risk.id || index}`}
                  risk={risk}
                  isActive={activeRiskId === risk.id}
                  onClick={() => onRiskSelect && risk.id && onRiskSelect(risk.id)}
                />
              ))}
            </div>
          </Document>
        </div>
      </div>
    </div>
  );
};
