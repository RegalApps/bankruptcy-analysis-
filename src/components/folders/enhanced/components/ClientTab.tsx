
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
  
  // Enhanced error handler with better logging
  const handleError = useCallback(() => {
    console.error(`ClientTab: Error loading client ID: ${clientId}`);
    setLoadError(true);
    
    toast.error("Could not load client information", {
      description: "There was a problem retrieving client data"
    });
  }, [clientId]);
  
  // Reset states when client ID changes to prevent UI glitches
  useEffect(() => {
    console.log("ClientTab: Client ID changed to", clientId);
    setLoadError(false);
    setRetryCount(0);
    setIsTransitioning(true);
    
    // Add a small delay to prevent flickering/glitching during transitions
    const timer = setTimeout(() => {
      if (mountedRef.current) {
        console.log("ClientTab: Transition complete, rendering client view");
        setIsTransitioning(false);
      }
    }, 150);
    
    return () => {
      clearTimeout(timer);
    };
  }, [clientId]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log("ClientTab: Component unmounting");
      mountedRef.current = false;
    };
  }, []);
  
  // Special handling for Josh Hart client
  useEffect(() => {
    // If we get an error but the client ID contains "josh" or "hart", 
    // it's likely our form-47 client and we can try to simplify the ID
    if (loadError && 
        (clientId.toLowerCase().includes('josh') || clientId.toLowerCase().includes('hart')) && 
        retryCount < 1) {
      console.log("ClientTab: Detected Josh Hart client with error, simplifying ID for retry");
      setRetryCount(prev => prev + 1);
      setRetryId('josh-hart');
      setLoadError(false);
      toast.info("Retrying client data load with simplified ID");
    }
  }, [loadError, clientId, retryCount]);
  
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
        <LoadingSpinner size="large" />
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
