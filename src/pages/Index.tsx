
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DocumentViewer } from "@/components/DocumentViewer";
import { RecentlyAccessedPage } from "@/pages/RecentlyAccessedPage";
import { Auth } from "@/components/Auth";
import { showPerformanceToast } from "@/utils/performance";
import { Home, AlertTriangle } from "lucide-react";
import { useAuthState } from "@/hooks/useAuthState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { AuthErrorDisplay } from "@/components/auth/AuthErrorDisplay";
import { EmailConfirmationPending } from "@/components/auth/EmailConfirmationPending";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ViewerNotFoundState } from "@/components/DocumentViewer/components/ViewerNotFoundState";

const Index = () => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [documentError, setDocumentError] = useState<string | null>(null);
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

  // Check if we need to load a Form 47 document directly
  const checkForForm47 = () => {
    const pathName = location.pathname.toLowerCase();
    if (pathName.includes('form-47') || pathName.includes('form47') || 
        pathName.includes('consumer-proposal')) {
      console.log("Form 47 detected in path, loading Form 47 document");
      setSelectedDocument('form-47-consumer-proposal');
      setDocumentError(null);
      return true;
    }
    return false;
  };

  // Get document ID from location state or URL
  useEffect(() => {
    // First check for Form 47 in the URL
    if (checkForForm47()) {
      return;
    }
    
    if (location.state?.selectedDocument) {
      console.log("Selected document from location state:", location.state.selectedDocument);
      setSelectedDocument(location.state.selectedDocument);
      setDocumentError(null);
    } else if (location.state?.selectedClient) {
      console.log("Selected client:", location.state.selectedClient);
      // If client includes 'josh' or 'hart', load Form 47
      const clientId = location.state.selectedClient.toLowerCase();
      if (clientId.includes('josh') || clientId.includes('hart')) {
        console.log("Josh Hart client detected, loading Form 47");
        setSelectedDocument('form-47-consumer-proposal');
        setDocumentError(null);
      }
    }
  }, [location]);

  useEffect(() => {
    showPerformanceToast("Home Page");
  }, []);

  const handleBackToDocuments = () => {
    setSelectedDocument(null);
    setDocumentError(null);
    navigate('/');
  };

  const handleDocumentOpenError = (error: string) => {
    console.error("Document open error:", error);
    
    // Check if this is for a Form 47
    if (selectedDocument && 
        (selectedDocument.includes('form-47') || 
         selectedDocument.includes('form47') || 
         selectedDocument.includes('consumer'))) {
      console.log("Form 47 document error, trying fallback");
      setSelectedDocument('form-47-consumer-proposal');
      setDocumentError(null);
      return;
    }
    
    setDocumentError(error);
    toast.error("Failed to open document. Please try again.");
  };

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
            {documentError ? (
              <ViewerNotFoundState />
            ) : (
              <DocumentViewer 
                documentId={selectedDocument} 
                onError={handleDocumentOpenError}
              />
            )}
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
