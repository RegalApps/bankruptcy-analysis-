
import { useState, useEffect } from "react";
import { DocumentViewer } from "@/components/DocumentViewer";
import { DocumentManagementPage } from "@/pages/DocumentManagementPage";
import { Auth } from "@/components/Auth";
import { supabase } from "@/lib/supabase";
import { useDocuments } from "@/components/DocumentList/hooks/useDocuments";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { MainHeader } from "@/components/header/MainHeader";
import { FolderManagement } from "@/components/folders/FolderManagement";

const Index = () => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { documents } = useDocuments();

  useEffect(() => {
    console.log("Initializing auth state...");
    setIsLoading(true);
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Session state:", session);
      setSession(session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", session);
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  if (selectedDocument) {
    return (
      <div className="container py-8">
        <div className="space-y-6">
          <button
            onClick={() => setSelectedDocument(null)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Documents
          </button>
          <DocumentViewer documentId={selectedDocument} />
        </div>
      </div>
    );
  }

  return <DocumentManagementPage />;
};

export default Index;
