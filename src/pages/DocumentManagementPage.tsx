
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
import {
  Github,
  Upload,
  Search,
  Twitter,
  LinkedinIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";
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
    <div className="min-h-screen flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 py-6">
        {/* Header with Search */}
        <header className="space-y-6 mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Document Management</h1>
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
          <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        </header>

        {/* Upload Section */}
        <section className="mb-8">
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Drag and drop your documents here</h3>
            <p className="text-sm text-gray-500 mb-4">or click to browse</p>
            <input
              type="file"
              className="hidden"
              id="fileInput"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // Handle file upload
                }
              }}
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              Browse Files
            </Button>
          </div>
        </section>

        {/* Recent Documents */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Recently Uploaded</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DocumentManagement />
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t bg-background mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Support
              </a>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <LinkedinIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Github className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DocumentManagementPage;
