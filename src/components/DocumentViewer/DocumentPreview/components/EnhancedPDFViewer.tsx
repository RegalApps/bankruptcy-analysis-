
import React, { useState, useEffect, useRef } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { AlertTriangle, Download, ExternalLink, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RiskHighlightOverlay } from "./RiskHighlightOverlay";
import { Risk } from "../../types";
import { useRiskHighlights } from "../hooks/useRiskHighlights";
import { supabase } from "@/lib/supabase";

interface EnhancedPDFViewerProps {
  fileUrl: string | null;
  title: string;
  zoomLevel: number;
  documentId: string;
  risks?: Risk[];
  activeRiskId?: string | null;
  onRiskSelect?: (riskId: string) => void;
  onLoad?: () => void;
  onError?: (errorMessage?: string) => void;
}

export const EnhancedPDFViewer: React.FC<EnhancedPDFViewerProps> = ({
  fileUrl,
  title,
  zoomLevel,
  documentId,
  risks = [],
  activeRiskId = null,
  onRiskSelect = () => {},
  onLoad,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [useGoogleViewer, setUseGoogleViewer] = useState(false);
  const [forceReload, setForceReload] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [localZoom, setLocalZoom] = useState(zoomLevel);
  const [refreshedUrl, setRefreshedUrl] = useState<string | null>(null);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const objectRef = useRef<HTMLObjectElement>(null);
  
  const {
    documentContainerRef,
    documentDimensions,
    handleRiskClick,
    highlightRisks
  } = useRiskHighlights(documentId, risks, onRiskSelect);

  useEffect(() => {
    setLocalZoom(zoomLevel);
  }, [zoomLevel]);

  useEffect(() => {
    // Add stabilization timeout to ensure PDF is fully rendered before showing risk highlights
    if (pdfLoaded) {
      const stabilizationTimer = setTimeout(() => {
        // Force a refresh of the component dimensions after PDF has stabilized
        if (documentContainerRef.current) {
          const { width, height } = documentContainerRef.current.getBoundingClientRect();
          console.log("PDF stabilized with dimensions:", { width, height });
        }
      }, 500);
      
      return () => clearTimeout(stabilizationTimer);
    }
  }, [pdfLoaded]);

  const getStoragePathFromUrl = (url: string): string | null => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      for (let i = 0; i < pathParts.length; i++) {
        if (pathParts[i] === 'object' && pathParts[i+1] === 'sign' && pathParts[i+2] === 'documents') {
          return pathParts.slice(i+2).join('/').split('?')[0];
        }
      }
      return null;
    } catch (e) {
      console.error("Error parsing URL:", e);
      return null;
    }
  };

  const refreshToken = async () => {
    if (!fileUrl) return false;
    
    try {
      const storagePath = getStoragePathFromUrl(fileUrl);
      if (!storagePath) {
        console.error("Could not extract storage path from URL:", fileUrl);
        return false;
      }
      
      console.log("Attempting to refresh token for path:", storagePath);
      
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(storagePath, 3600);
      
      if (error) {
        console.error("Error refreshing token:", error);
        return false;
      }
      
      if (data?.signedUrl) {
        console.log("Successfully refreshed token, new URL obtained");
        setRefreshedUrl(data.signedUrl);
        return true;
      }
      
      return false;
    } catch (e) {
      console.error("Exception during token refresh:", e);
      return false;
    }
  };

  const currentUrl = refreshedUrl || fileUrl;
  const cacheBustedUrl = currentUrl ? `${currentUrl}${currentUrl.includes('?') ? '&' : '?'}t=${Date.now()}-${forceReload}` : '';
  const googleDocsViewerUrl = currentUrl ? 
    `https://docs.google.com/viewer?url=${encodeURIComponent(currentUrl)}&embedded=true` : '';

  useEffect(() => {
    if (fileUrl) {
      setIsLoading(true);
      setPdfLoaded(false);
      setLoadError(null);
      setRetryCount(0);
    }
  }, [fileUrl, forceReload, refreshedUrl]);

  const handleLoadSuccess = () => {
    setIsLoading(false);
    setPdfLoaded(true);
    setLoadError(null);
    setRetryCount(0);
    if (onLoad) onLoad();
  };

  const handleLoadError = async (errorEvent?: any) => {
    console.error("Error loading PDF:", fileUrl, errorEvent);
    const errorMessage = errorEvent?.message || "Unknown error loading document";
    
    setRetryCount(prev => prev + 1);
    
    const isTokenError = errorMessage.includes('token') || 
                        errorMessage.includes('JWT') || 
                        errorMessage.includes('401') || 
                        errorMessage.includes('403') ||
                        errorMessage.includes('authentication');
    
    if (isTokenError && retryCount < 1) {
      console.log("Token error detected, attempting to refresh...");
      const refreshSuccess = await refreshToken();
      if (refreshSuccess) {
        console.log("Token refreshed successfully, retrying load...");
        return;
      }
    }
    
    if (retryCount === 1 && !isTokenError) {
      console.log("First load failed, retrying immediately");
      setForceReload(prev => prev + 1);
      return;
    }
    
    if (!useGoogleViewer && retryCount >= 2) {
      console.log("Falling back to Google Docs viewer");
      setUseGoogleViewer(true);
      setIsLoading(true);
    } else if (useGoogleViewer && retryCount >= 3) {
      const errorMsg = isTokenError ? 
        "Authentication error: Your session may have expired." : 
        "Could not load the document. It may be in an unsupported format or inaccessible.";
      
      setIsLoading(false);
      setPdfLoaded(false);
      setLoadError(errorMsg);
      if (onError) onError(errorMsg);
    }
  };

  const handleOpenInNewTab = () => {
    if (currentUrl) {
      window.open(currentUrl, '_blank');
      toast.success("Document opened in new tab");
    }
  };

  const handleZoomIn = () => {
    setLocalZoom(prev => Math.min(prev + 10, 200));
  };
  
  const handleZoomOut = () => {
    setLocalZoom(prev => Math.max(prev - 10, 50));
  };

  const handleDownload = () => {
    if (currentUrl) {
      const link = document.createElement('a');
      link.href = currentUrl;
      link.download = title || 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Download started");
    }
  };

  const handleRetry = async () => {
    const refreshed = await refreshToken();
    if (!refreshed) {
      setUseGoogleViewer(false);
      setLoadError(null);
      setIsLoading(true);
      setPdfLoaded(false);
      setRetryCount(0);
      setForceReload(prev => prev + 1);
    }
  };

  if (!currentUrl) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/30">
        <p className="text-muted-foreground">No document URL provided</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/30">
        <div className="text-center max-w-md p-6">
          <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Document Load Error</h3>
          <p className="text-muted-foreground mb-6">{loadError}</p>
          <div className="flex flex-col gap-3">
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" onClick={handleOpenInNewTab} className="w-full">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
            <Button variant="outline" onClick={handleDownload} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={documentContainerRef} className="relative w-full h-full">
      <div className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-background/80 p-1 rounded-md shadow-sm">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-xs font-medium w-12 text-center">{localZoom}%</span>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="text-center">
            <LoadingSpinner size="large" className="mx-auto mb-4" />
            <p className="text-muted-foreground">Loading document...</p>
            {retryCount > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                {retryCount === 1 ? "Retrying..." : 
                 useGoogleViewer ? "Using alternative viewer..." : 
                 "Attempting direct view..."}
              </p>
            )}
          </div>
        </div>
      )}

      {useGoogleViewer ? (
        <iframe
          src={googleDocsViewerUrl}
          className="w-full h-full border-0"
          onLoad={handleLoadSuccess}
          onError={() => handleLoadError()}
          title={`Google Docs viewer: ${title}`}
          referrerPolicy="no-referrer"
          allow="fullscreen"
        />
      ) : (
        <object
          ref={objectRef}
          data={cacheBustedUrl}
          type="application/pdf"
          className="w-full h-full"
          style={{transform: `scale(${localZoom / 100})`, transformOrigin: 'center top'}}
          onLoad={handleLoadSuccess}
          onError={(e) => handleLoadError(e)}
        >
          <iframe
            ref={iframeRef}
            src={cacheBustedUrl}
            className="w-full h-full border-0"
            title={`Document Preview: ${title}`}
            style={{transform: `scale(${localZoom / 100})`, transformOrigin: 'center top'}}
            onLoad={handleLoadSuccess}
            onError={(e) => handleLoadError(e)}
            sandbox="allow-same-origin allow-scripts allow-forms"
            referrerPolicy="no-referrer"
            allow="fullscreen"
          />
        </object>
      )}
      
      {pdfLoaded && highlightRisks.length > 0 && !useGoogleViewer && (
        <RiskHighlightOverlay
          risks={highlightRisks}
          documentWidth={documentDimensions.width}
          documentHeight={documentDimensions.height}
          onRiskClick={handleRiskClick}
          activeRiskId={activeRiskId}
        />
      )}
    </div>
  );
};
