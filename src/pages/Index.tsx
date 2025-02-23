
import { useState, useEffect } from "react";
import { DocumentViewer } from "@/components/DocumentViewer";
import { DocumentManagementPage } from "@/pages/DocumentManagementPage";
import { Auth } from "@/components/Auth";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Initializing auth state...");
    setIsLoading(true);
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Session state:", session);
      setSession(session);
      setIsLoading(false);
    });

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", session);
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-background">
      {!selectedDocument ? (
        <DocumentManagementPage />
      ) : (
        <div className="container py-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedDocument(null)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back to Documents
              </button>
            </div>
            <DocumentViewer documentId={selectedDocument} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
