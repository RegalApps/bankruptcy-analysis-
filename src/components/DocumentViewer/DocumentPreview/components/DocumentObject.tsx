
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";
import logger from "@/utils/logger";

interface DocumentObjectProps {
  publicUrl: string;
  onError?: () => void;
}

export const DocumentObject: React.FC<DocumentObjectProps> = ({ 
  publicUrl, 
  onError 
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [objectLoading, setObjectLoading] = useState(true);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    // Reset loading state when URL changes
    setObjectLoading(true);
    setLoadError(null);
    
    logger.info(`Loading document from URL: ${publicUrl}`);
    
    // Add cache-busting parameter to URL
    const cacheBustUrl = `${publicUrl}?t=${Date.now()}`;
    
    // Update iframe src
    if (iframeRef.current) {
      iframeRef.current.src = cacheBustUrl;
    }
    
    // Attempt to pre-fetch the document to verify it exists
    const checkDocumentExists = async () => {
      try {
        const response = await fetch(cacheBustUrl, { 
          method: 'HEAD',
          cache: 'no-store' as RequestCache
        });
        
        if (!response.ok) {
          logger.error(`Document fetch error: ${response.status} ${response.statusText}`);
          setLoadError(`Error ${response.status}: ${response.statusText}`);
          setObjectLoading(false);
          if (onError) onError();
        }
      } catch (err) {
        logger.error('Error pre-fetching document:', err);
        // We'll let the iframe handle the error display
      }
    };
    
    checkDocumentExists();
    
    // Setup a timeout in case the iframe load event doesn't fire
    const timeoutId = setTimeout(() => {
      if (objectLoading) {
        logger.warn('Document load timeout after 15 seconds');
        setLoadAttempts(prev => prev + 1);
        
        if (loadAttempts >= 2) {
          setLoadError("Document load timed out after multiple attempts. The file may be too large or in an unsupported format.");
          setObjectLoading(false);
          if (onError) onError();
        }
      }
    }, 15000);
    
    return () => clearTimeout(timeoutId);
  }, [publicUrl, onError, loadAttempts, objectLoading]);

  const handleLoad = () => {
    logger.info('Document loaded successfully');
    setObjectLoading(false);
    setLoadError(null);
  };

  const handleError = () => {
    logger.error('Error loading document in iframe');
    setLoadError("The document couldn't be displayed. It may be in an unsupported format or inaccessible.");
    setObjectLoading(false);
    if (onError) onError();
  };

  return (
    <div className="relative w-full rounded-md overflow-hidden border">
      {objectLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30 z-10">
          <div className="w-full max-w-md">
            <Skeleton className="h-[60vh] w-full rounded-md" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="space-y-2 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="text-sm">Loading document preview...</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/10 z-10">
          <div className="bg-destructive/10 border border-destructive/30 p-4 rounded-md max-w-md text-center space-y-3">
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto" />
            <p className="text-sm font-medium">{loadError}</p>
            <p className="text-xs text-muted-foreground">
              Try downloading the document directly if you need to view its contents.
            </p>
          </div>
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        className="w-full h-[70vh] border-0"
        title="Document Preview"
        src={`${publicUrl}?t=${Date.now()}`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};
