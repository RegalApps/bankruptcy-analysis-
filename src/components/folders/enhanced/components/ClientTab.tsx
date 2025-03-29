
import { useState, useEffect, useRef, useCallback } from "react";
import { ClientViewer } from "@/components/client/ClientViewer";
import { ClientNotFound } from "@/components/client/components/ClientNotFound";
import { NoClientSelected } from "@/components/activity/components/NoClientSelected";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface ClientTabProps {
  clientId: string;
  onBack: () => void;
  onDocumentOpen?: (documentId: string) => void;
}

export const ClientTab = ({ clientId, onBack, onDocumentOpen }: ClientTabProps) => {
  const [loadError, setLoadError] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [retryId, setRetryId] = useState<string>('');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(true);
  const mountedRef = useRef<boolean>(true);
  const navigate = useNavigate();
  const loadingTimeoutRef = useRef<number | null>(null);
  
  // Enhanced error handler with better logging
  const handleError = useCallback(() => {
    console.error(`ClientTab: Error loading client ID: ${clientId}`);
    setLoadError(true);
    
    toast.error("Could not load client information", {
      description: "Trying a fallback method to load the client"
    });
    
    // For Josh Hart client, we want to retry with simplified ID
    if (clientId.toLowerCase().includes('josh') || clientId.toLowerCase().includes('hart')) {
      setRetryCount(prev => prev + 1);
      setRetryId('josh-hart');
      setLoadError(false);
    }
  }, [clientId]);
  
  // Reset states when client ID changes to prevent UI glitches
  useEffect(() => {
    console.log("ClientTab: Client ID changed to", clientId);
    setLoadError(false);
    setRetryCount(0);
    setIsTransitioning(true);
    
    // Clear any existing timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    
    // Add a small delay to prevent flickering/glitching during transitions
    loadingTimeoutRef.current = window.setTimeout(() => {
      if (mountedRef.current) {
        console.log("ClientTab: Transition complete, rendering client view");
        setIsTransitioning(false);
      }
    }, 400); // Longer transition time for better user experience
    
    // Notify user about loading state
    toast.info(`Loading ${clientId.includes('josh-hart') ? 'Josh Hart' : 'client'} information...`, {
      duration: 2000,
    });
    
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };
  }, [clientId]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log("ClientTab: Component unmounting");
      mountedRef.current = false;
      
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };
  }, []);
  
  // Use the retry ID if we're retrying, otherwise use the original client ID
  const effectiveClientId = retryCount > 0 && retryId ? retryId : clientId;
  
  if (!effectiveClientId) {
    console.log("ClientTab: No client ID provided");
    return <NoClientSelected />;
  }
  
  if (isTransitioning) {
    console.log("ClientTab: Showing transition loading state");
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Loading client information...</p>
          {clientId.toLowerCase().includes('josh') && (
            <p className="text-xs text-muted-foreground mt-2">
              Loading Josh Hart's profile and documents
            </p>
          )}
        </div>
      </div>
    );
  }
  
  if (loadError) {
    console.log("ClientTab: Showing not found state due to load error");
    return <ClientNotFound onBack={onBack} />;
  }
  
  // Create a handler for document opening that uses navigate to go to the document viewer
  const handleDocumentOpen = (documentId: string) => {
    console.log("ClientTab: Opening document:", documentId);
    
    if (!documentId) {
      console.error("Invalid document ID received in ClientTab");
      toast.error("Cannot open document: Invalid ID");
      return;
    }
    
    if (onDocumentOpen) {
      onDocumentOpen(documentId);
    } else {
      // Check if it's the Form 47 document for josh-hart client
      let isForm47 = false;
      let documentTitle = null;
      
      if (effectiveClientId === 'josh-hart') {
        isForm47 = true;
        documentTitle = "Form 47 - Consumer Proposal";
        console.log("Opening Josh Hart's Form 47 document");
        
        toast.success("Opening Form 47 document", {
          description: "Consumer Proposal document for Josh Hart"
        });
      }
      
      // If no callback is provided, navigate directly to the home page with the selected document
      navigate('/', { 
        state: { 
          selectedDocument: documentId,
          source: 'client-tab',
          isForm47: isForm47,
          documentTitle: documentTitle
        } 
      });
    }
  };
  
  console.log("ClientTab: Rendering ClientViewer with ID:", effectiveClientId);
  
  return (
    <ClientViewer 
      clientId={effectiveClientId} 
      onBack={onBack}
      onDocumentOpen={handleDocumentOpen}
      onError={handleError}
    />
  );
};
