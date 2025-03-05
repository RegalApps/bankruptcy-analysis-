
import { useState, useEffect } from "react";
import { DocumentViewer } from "@/components/DocumentViewer";
import { DocumentManagementPage } from "@/pages/DocumentManagementPage";
import { Auth } from "@/components/Auth";
import { supabase } from "@/lib/supabase";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { MainHeader } from "@/components/header/MainHeader";
import { Footer } from "@/components/layout/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { showPerformanceToast } from "@/utils/performance";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const Index = () => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.selectedDocument) {
      setSelectedDocument(location.state.selectedDocument);
    }
  }, [location]);

  useEffect(() => {
    // Measure and show performance metrics when the page loads
    showPerformanceToast("Home Page");
  }, []);

  useEffect(() => {
    console.log("Initializing auth state...");
    setIsLoading(true);
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Session state:", session);
      setSession(session);
      setIsLoading(false);
    }).catch(error => {
      console.error("Error fetching session:", error);
      setIsLoading(false);
      setAuthError(error.message);
    });

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", session);
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleBackToDocuments = () => {
    setSelectedDocument(null);
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-xl font-semibold mb-4">Authentication Error</h2>
          <p className="text-muted-foreground mb-6">{authError}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // If no session is found, redirect to auth page
  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen flex">
      <MainSidebar />
      <div className="flex-1 pl-64 flex flex-col">
        <MainHeader />
        <main className="flex-1">
          {selectedDocument ? (
            <div className="container py-8">
              <div className="space-y-6">
                <button
                  onClick={handleBackToDocuments}
                  className="flex items-center text-sm text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-4 w-4 mr-1" /> Back to Documents
                </button>
                <DocumentViewer documentId={selectedDocument} />
              </div>
            </div>
          ) : (
            <DocumentManagementPage />
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
