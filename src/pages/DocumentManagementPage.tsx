
import { DocumentManagement } from "@/components/DocumentList/DocumentManagement";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import { useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { SearchBar } from "@/components/DocumentList/SearchBar";

export const DocumentManagementPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const handleUploadComplete = useCallback(async (documentId: string) => {
    toast({
      title: "Success",
      description: "Document uploaded successfully",
    });
  }, [toast]);

  return (
    <div className="min-h-screen flex">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex flex-col px-6 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Document Management</h1>
            </div>
            
            {/* Search Bar */}
            <div className="w-full max-w-2xl">
              <SearchBar 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>

            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Upload New Document</DialogTitle>
                  </DialogHeader>
                  <div className="p-4">
                    <FileUpload onUploadComplete={handleUploadComplete} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Drag and Drop Upload Area */}
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Drag and drop your documents here
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse your files
              </p>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Handle file upload
                  }
                }}
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                Browse Files
              </Button>
            </CardContent>
          </Card>

          {/* Recently Uploaded Documents */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Recently Uploaded</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DocumentManagement />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocumentManagementPage;
