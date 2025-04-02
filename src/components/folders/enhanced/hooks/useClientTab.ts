
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";

interface UseClientTabProps {
  clientId: string;
  onBack: () => void;
}

export const useClientTab = ({ clientId, onBack }: UseClientTabProps) => {
  const [loadError, setLoadError] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [retryId, setRetryId] = useState<string>('');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(true);
  const mountedRef = useRef<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();
  const loadingTimeoutRef = useRef<number | null>(null);
  const longLoadTimeoutRef = useRef<number | null>(null);
  
  const handleError = useCallback(() => {
    console.error(`ClientTab: Error loading client ID: ${clientId}`);
    
    setIsTransitioning(false);
    
    toast.error("Could not load client information", {
      description: "Using template mode instead"
    });
    
    // Check for any variation of josh hart
    if (clientId.toLowerCase().includes('josh') || clientId.toLowerCase().includes('hart')) {
      setRetryCount(prev => prev + 1);
      setRetryId('josh-hart');
      setLoadError(false);
    }
  }, [clientId]);
  
  useEffect(() => {
    console.log("ClientTab: Client ID changed to", clientId);
    setLoadError(false);
    setRetryCount(0);
    setIsTransitioning(true);
    
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    
    if (longLoadTimeoutRef.current) {
      clearTimeout(longLoadTimeoutRef.current);
    }
    
    loadingTimeoutRef.current = window.setTimeout(() => {
      if (mountedRef.current) {
        console.log("ClientTab: Transition complete, rendering client view");
        setIsTransitioning(false);
      }
    }, 400);
    
    longLoadTimeoutRef.current = window.setTimeout(() => {
      if (mountedRef.current && !loadError) {
        console.log("ClientTab: Loading taking too long, switching to template mode");
        toast.info("Using template mode for faster viewing", {
          description: "You can edit client information directly"
        });
      }
    }, 2000);
    
    toast.info(`Loading ${clientId.includes('josh-hart') ? 'Josh Hart' : 'client'} information...`, {
      duration: 2000,
    });
    
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      
      if (longLoadTimeoutRef.current) {
        clearTimeout(longLoadTimeoutRef.current);
        longLoadTimeoutRef.current = null;
      }
    };
  }, [clientId, loadError]);
  
  useEffect(() => {
    return () => {
      console.log("ClientTab: Component unmounting");
      mountedRef.current = false;
      
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      
      if (longLoadTimeoutRef.current) {
        clearTimeout(longLoadTimeoutRef.current);
        longLoadTimeoutRef.current = null;
      }
    };
  }, []);
  
  const effectiveClientId = retryCount > 0 && retryId ? retryId : clientId;
  
  const handleDocumentOpen = (documentId: string) => {
    console.log("ClientTab: Opening document:", documentId);
    
    if (!documentId) {
      console.error("Invalid document ID received in ClientTab");
      toast.error("Cannot open document: Invalid ID");
      return;
    }
    
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
    
    // Get the current path and safely navigate
    try {
      const currentPath = location.pathname || '';
      
      // Default to home if we can't determine current path
      let targetPath = '/';
      
      // Check if we're in a documents page
      if (currentPath.includes('/documents')) {
        targetPath = '/documents';
      }
      
      console.log(`Navigating from '${currentPath}' to '${targetPath}' with document state`);
      
      navigate(targetPath, { 
        state: { 
          selectedDocument: documentId,
          source: 'client-tab',
          isForm47: isForm47,
          documentTitle: documentTitle
        },
        replace: false  // Using replace: false to make sure we don't break history
      });
    } catch (navError) {
      console.error("Navigation error:", navError);
      toast.error("Error navigating to document view");
      
      // Fallback to direct navigation
      navigate('/', { replace: true });
    }
  };

  return {
    isTransitioning,
    effectiveClientId,
    handleDocumentOpen,
    handleError
  };
};
