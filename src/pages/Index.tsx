import { useState, useEffect } from "react";
import { DocumentViewer } from "@/components/DocumentViewer";
import { DocumentManagement } from "@/pages/DocumentManagementPage";
import { Auth } from "@/components/Auth";
import { supabase } from "@/lib/supabase";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Activity,
  Bell,
  FileText,
  Folder,
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
import { FolderIcon } from "@/components/DocumentList/components/FolderIcon";

const Index = () => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFolderDialog, setShowFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
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

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert([
          {
            title: newFolderName,
            is_folder: true,
            folder_type: 'client',
          }
        ]);

      if (error) throw error;
      setShowFolderDialog(false);
      setNewFolderName("");
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="w-16 h-screen bg-background border-r flex flex-col items-center py-4 space-y-4 fixed">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-8">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <nav className="flex-1 w-full flex flex-col items-center space-y-2">
            <Button variant="ghost" size="icon" className="w-10 h-10">
              <Home className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "w-10 h-10",
                "relative after:content-[''] after:absolute after:inset-0 after:rounded-md after:ring-2 after:ring-primary/50"
              )}
            >
              <Folder className="h-5 w-5 text-primary" />
            </Button>
            <Button variant="ghost" size="icon" className="w-10 h-10">
              <Activity className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="w-10 h-10">
              <PieChart className="h-5 w-5" />
            </Button>
          </nav>
          <div className="mt-auto space-y-2">
            <Button variant="ghost" size="icon" className="w-10 h-10">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="w-10 h-10">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </aside>
        <main className="flex-1 pl-16">
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
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-2 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Folder Management</h3>
                    <Dialog open={showFolderDialog} onOpenChange={setShowFolderDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <FolderPlus className="h-4 w-4 mr-2" />
                          New Folder
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create New Folder</DialogTitle>
                          <DialogDescription>
                            Enter a name for your new folder. You can drag and drop documents into it later.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <Input
                            placeholder="Folder name"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                          />
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowFolderDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreateFolder}>
                            Create Folder
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <ScrollArea className="h-[300px]">
                    <div 
                      className={cn(
                        "grid gap-4 md:grid-cols-2",
                        isDragging && "ring-2 ring-primary/50 rounded-lg p-4"
                      )}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        // Handle drop logic here
                      }}
                    >
                      {Object.entries(documents.reduce((acc, doc) => {
                        if (doc.is_folder) {
                          acc[doc.title] = {
                            id: doc.id,
                            documents: documents.filter(d => d.parent_folder_id === doc.id)
                          };
                        }
                        return acc;
                      }, {} as Record<string, { id: string; documents: typeof documents }>)).map(([folderName, folder]) => (
                        <div
                          key={folder.id}
                          className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                          draggable
                        >
                          <div className="flex items-center space-x-3">
                            <FolderIcon variant="client" />
                            <div>
                              <h4 className="font-medium">{folderName}</h4>
                              <p className="text-sm text-muted-foreground">
                                {folder.documents.length} documents
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>
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
