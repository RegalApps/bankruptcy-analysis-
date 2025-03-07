
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DocumentViewer } from "@/components/DocumentViewer";
import { DocumentManagementPage } from "@/pages/DocumentManagementPage";
import { Auth } from "@/components/Auth";
import { showPerformanceToast } from "@/utils/performance";
import { Home } from "lucide-react";
import { useAuthState } from "@/hooks/useAuthState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { AuthErrorDisplay } from "@/components/auth/AuthErrorDisplay";
import { EmailConfirmationPending } from "@/components/auth/EmailConfirmationPending";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
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

  useEffect(() => {
    if (location.state?.selectedDocument) {
      setSelectedDocument(location.state.selectedDocument);
    }
  }, [location]);

  useEffect(() => {
    showPerformanceToast("Home Page");
  }, []);

  const handleBackToDocuments = () => {
    setSelectedDocument(null);
    navigate('/');
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
        <div className="h-[calc(100vh-4rem)] flex flex-col">
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
            <DocumentViewer documentId={selectedDocument} />
          </div>
        </div>
      ) : (
        <MainLayout>
          <DocumentManagementPage />
        </MainLayout>
      )}
    </div>
  );
};

export default Index;
