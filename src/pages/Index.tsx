
import { useState, useEffect } from "react";
import { FileUpload } from "@/components/FileUpload";
import { DocumentCard } from "@/components/DocumentCard";
import { DocumentViewer } from "@/components/DocumentViewer";
import { Auth } from "@/components/Auth";
import { Plus, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchDocuments();
    }
  }, [session]);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <main className="container py-8">
        {!selectedDocument ? (
          <>
            <div className="mb-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-semibold tracking-tight">Document Management</h1>
                  <p className="text-lg text-muted-foreground">
                    Upload, organize, and manage your documents efficiently
                  </p>
                </div>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Sign Out
                </button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search documents..."
                      className="w-full pl-10 pr-4 py-2 rounded-md border bg-background"
                    />
                  </div>
                  <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    New Document
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {documents.map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      title={doc.title}
                      type={doc.type}
                      date={`Updated ${new Date(doc.updated_at).toLocaleDateString()}`}
                      onClick={() => setSelectedDocument(doc.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-lg border bg-card p-4">
                  <h2 className="text-lg font-semibold mb-4">Upload Documents</h2>
                  <FileUpload />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedDocument(null)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back to Documents
              </button>
              <h2 className="text-xl font-semibold">
                {documents.find(d => d.id === selectedDocument)?.title}
              </h2>
            </div>
            <DocumentViewer documentId={selectedDocument} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
