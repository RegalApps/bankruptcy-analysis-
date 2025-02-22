
import { useState, useEffect } from "react";
import { DocumentViewer } from "@/components/DocumentViewer";
import { DocumentManagement } from "@/components/DocumentList/DocumentManagement";
import { Auth } from "@/components/Auth";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    console.log("Initializing auth state...");
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Session state:", session);
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", session);
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <main className="container py-8">
        {!selectedDocument ? (
          <DocumentManagement onDocumentSelect={setSelectedDocument} />
        ) : (
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
        )}
      </main>
    </div>
  );
};

export default Index;
