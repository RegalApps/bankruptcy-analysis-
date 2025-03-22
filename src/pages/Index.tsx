
import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DocumentViewer } from "@/components/DocumentViewer";
import { RecentlyAccessedPage } from "@/pages/RecentlyAccessedPage";
import { Auth } from "@/components/Auth";
import { showPerformanceToast } from "@/utils/performance";
import { Home } from "lucide-react";
import { useAuthState } from "@/hooks/useAuthState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { AuthErrorDisplay } from "@/components/auth/AuthErrorDisplay";
import { EmailConfirmationPending } from "@/components/auth/EmailConfirmationPending";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { isDebugMode, debugTiming } from "@/utils/debugMode";

const Index = () => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [documentKey, setDocumentKey] = useState<number>(0); // Key for forcing re-render
  const [documentTitle, setDocumentTitle] = useState<string | null>(null);
  const [isForm47, setIsForm47] = useState<boolean>(false);
  const [loadFailed, setLoadFailed] = useState<boolean>(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    session, 
    isLoading, 
    authError, 
    isEmailConfirmationPending, 
    confirmationEmail,
    handleSignOut
  } = useAuthState();

  // Effect to handle document selection from location state
  useEffect(() => {
    if (location.state?.selectedDocument) {
      console.log("Setting selected document from location state:", location.state.selectedDocument);
      console.log("Source:", location.state.source || "unknown");
      
      const loadStart = performance.now();
      setLoadFailed(false);
      
      // Validate document ID
      const docId = location.state.selectedDocument;
      if (!docId || typeof docId !== 'string') {
        toast.error("Invalid document ID provided");
        console.error("Invalid document ID:", docId);
        return;
      }
      
      // Set document metadata
      if (location.state.isForm47) {
        setIsForm47(true);
        console.log("Document is Form 47");
      }
      
      if (location.state.documentTitle) {
        setDocumentTitle(location.state.documentTitle);
        console.log("Document title:", location.state.documentTitle);
      }
      
      // Force component re-render with a new key when opening a new document
      setDocumentKey(prev => prev + 1);
      setSelectedDocument(docId);
      
      // In debug mode, we want to log the timing but might not want to clear the state
      if (isDebugMode()) {
        debugTiming('document-state-load', performance.now() - loadStart);
      } else {
        // Clear the state to prevent issues with browser back navigation
        // but keep the URL clean by using replace state instead of pushing a new state
        navigate('/', { replace: true });
      }
    }
  }, [location, navigate]);

  useEffect(() => {
    showPerformanceToast("Home Page");
  }, []);

  const handleBackToDocuments = useCallback(() => {
    setSelectedDocument(null);
    setDocumentTitle(null);
    setIsForm47(false);
    setLoadFailed(false);
    navigate('/', { replace: true });
  }, [navigate]);

  // Handle document load failure
  const handleDocumentLoadFailure = useCallback(() => {
    console.log("Document load failed, showing error state");
    setLoadFailed(true);
  }, []);

  // Debug to check if we're getting the document ID
  useEffect(() => {
    if (selectedDocument) {
      console.log("Selected document in Index.tsx:", selectedDocument);
      if (isDebugMode()) {
        console.log("🛠️ DEBUG: Document viewer loaded in debug mode");
      }
    }
  }, [selectedDocument]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (authError) {
    return <AuthErrorDisplay error={authError} />;
  }

  if (session && isEmailConfirmationPending) {
    return (
      <EmailConfirmationPending 
        confirmationEmail={confirmationEmail} 
        onSignOut={handleSignOut} 
      />
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className={`min-h-screen bg-background ${selectedDocument ? 'flex flex-col' : ''}`}>
      {selectedDocument ? (
        <div className="h-screen flex flex-col">
          <div className="mb-1 px-1 py-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToDocuments}
              className="flex items-center text-xs text-muted-foreground hover:text-foreground"
            >
              <Home className="h-3.5 w-3.5 mr-1" /> Back to Documents
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            <DocumentViewer 
              documentId={selectedDocument} 
              key={`doc-${selectedDocument}-${documentKey}`}
              bypassProcessing={isDebugMode() || isForm47}
              onLoadFailure={handleDocumentLoadFailure}
              documentTitle={documentTitle}
              isForm47={isForm47}
            />
          </div>
        </div>
      ) : (
        <MainLayout>
          <RecentlyAccessedPage />
        </MainLayout>
      )}
    </div>
  );
};

export default Index;
