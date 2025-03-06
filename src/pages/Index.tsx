
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
    <MainLayout>
      {selectedDocument ? (
        <div className="h-full overflow-auto">
          <div className="container py-4 h-full">
            <div className="space-y-4 h-full">
              <button
                onClick={handleBackToDocuments}
                className="flex items-center text-sm text-muted-foreground hover:text-foreground"
              >
                <Home className="h-4 w-4 mr-1" /> Back to Documents
              </button>
              <DocumentViewer documentId={selectedDocument} />
            </div>
          </div>
        </div>
      ) : (
        <DocumentManagementPage />
      )}
    </MainLayout>
  );
};

export default Index;
