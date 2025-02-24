
import { useState, useEffect } from "react";
import { DocumentViewer } from "@/components/DocumentViewer";
import { DocumentManagementPage } from "@/pages/DocumentManagementPage";
import { Auth } from "@/components/Auth";
import { supabase } from "@/lib/supabase";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Activity,
  Bell,
  FileText,
  FolderPlus,
  Grid,
  Home,
  PieChart,
  Plus,
  Search,
  Settings,
  Tags,
  Upload,
  User
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { useDocuments } from "@/components/DocumentList/hooks/useDocuments";

const Index = () => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { documents } = useDocuments();

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

  // If a document is selected, show the document viewer
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

  // Main homepage content
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Main Navigation Sidebar */}
        <aside className="w-16 h-screen bg-background border-r flex flex-col items-center py-4 space-y-4 fixed">
          {/* Logo Section */}
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-8">
            <FileText className="w-6 h-6 text-primary" />
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 w-full flex flex-col items-center space-y-2">
            <Button variant="ghost" size="icon" className="w-10 h-10">
              <Home className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="w-10 h-10">
              <Grid className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="w-10 h-10">
              <Activity className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="w-10 h-10">
              <PieChart className="h-5 w-5" />
            </Button>
          </nav>

          {/* User Section */}
          <div className="mt-auto space-y-2">
            <Button variant="ghost" size="icon" className="w-10 h-10">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="w-10 h-10">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 pl-16">
          {/* Header */}
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
            <div className="flex h-14 items-center px-6 gap-4">
              <h1 className="text-xl font-semibold">Document Management</h1>
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search documents..."
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-md border bg-background"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <Tags className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Content Grid */}
          <div className="p-6">
            <div className="grid gap-6">
              {/* Upload Section */}
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

              {/* Recent Uploads & Quick Actions */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Recent Activity */}
                <Card className="col-span-2 p-6">
                  <h3 className="font-semibold mb-4">Recent Uploads</h3>
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-4">
                      {documents.slice(0, 5).map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer"
                          onClick={() => setSelectedDocument(doc.id)}
                        >
                          <div className="p-2 rounded-md bg-primary/10">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{doc.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Uploaded {new Date(doc.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>

                {/* Quick Actions */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <FolderPlus className="h-4 w-4 mr-2" />
                      Create New Folder
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Grid className="h-4 w-4 mr-2" />
                      View All Documents
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Tags className="h-4 w-4 mr-2" />
                      Manage Tags
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
