
import { useState, useEffect } from "react";
import { DocumentViewer } from "@/components/DocumentViewer";
import { DocumentManagementPage } from "@/pages/DocumentManagementPage";
import { Auth } from "@/components/Auth";
import { supabase } from "@/lib/supabase";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <MainSidebar />
        <main className="flex-1 pl-16">
          <MainHeader />
          <div className="p-6">
            <div className="grid gap-6">
              <section className="border rounded-lg p-8 bg-gradient-to-b from-background to-muted/20">
                <div className="max-w-2xl mx-auto text-center space-y-4">
                  <h2 className="text-2xl font-semibold">Upload Your Documents</h2>
                  <p className="text-muted-foreground">
                    Drag and drop your files here, or click to browse
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="lg" className="mt-4">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Document
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl">
                      <DialogHeader>
                        <DialogTitle>Upload New Document</DialogTitle>
                      </DialogHeader>
                      <FileUpload />
                    </DialogContent>
                  </Dialog>
                </div>
              </section>
              <FolderManagement documents={documents} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
