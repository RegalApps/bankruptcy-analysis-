
import { FileUpload } from "@/components/FileUpload";
import { Header } from "./Header";
import { SearchBar } from "./SearchBar";
import { DocumentList } from "./DocumentList";
import { DocumentUploadButton } from "./DocumentUploadButton";
import { useDocuments } from "./hooks/useDocuments";
import { Button } from "@/components/ui/button";
import { 
  MoreVertical, 
  Search,
  Plus,
  Grid, 
  List,
  File
} from "lucide-react";
import { DocumentNode } from "./types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DocumentManagementProps {
  onDocumentSelect: (id: string) => void;
}

export const DocumentManagement: React.FC<DocumentManagementProps> = ({ onDocumentSelect }) => {
  const { documents, treeData, isLoading } = useDocuments();
  const [searchQuery, setSearchQuery] = useState("");
  const [isGridView, setIsGridView] = useState(true);

  // Group documents by client
  const groupedByClient = documents.reduce((acc, doc) => {
    const clientName = doc.metadata?.client_name || 'Uncategorized';
    if (!acc[clientName]) {
      acc[clientName] = [];
    }
    acc[clientName].push(doc);
    return acc;
  }, {} as Record<string, typeof documents>);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Search Section */}
      <section className="border-b">
        <div className="container mx-auto py-8">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl font-semibold text-center">Search Documents</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by client name, form number, or document type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Document Folders Section */}
      <section className="container mx-auto py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Document Folders</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsGridView(true)}
                className={cn(isGridView && "bg-accent")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsGridView(false)}
                className={cn(!isGridView && "bg-accent")}
              >
                <List className="h-4 w-4" />
              </Button>
              <DocumentUploadButton />
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[200px] rounded-lg border bg-card animate-pulse" />
              ))}
            </div>
          ) : (
            <div className={cn(
              "grid gap-4",
              isGridView ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}>
              {Object.entries(groupedByClient)
                .filter(([clientName]) => 
                  clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  documents.some(doc => 
                    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    doc.type?.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                )
                .map(([clientName, clientDocs]) => (
                  <Card key={clientName} className="group hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-semibold">{clientName}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Document
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Delete Folder
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <File className="mr-2 h-4 w-4" />
                          {clientDocs.length} document{clientDocs.length !== 1 ? 's' : ''}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Last updated: {new Date(
                            Math.max(...clientDocs.map(d => new Date(d.updated_at).getTime()))
                          ).toLocaleDateString()}
                        </div>
                        <div className="mt-4">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => onDocumentSelect(clientDocs[0].id)}
                          >
                            View Documents
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* Upload Panel */}
      <div className="fixed bottom-6 right-6">
        <div className="rounded-lg border bg-card p-4 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Upload Documents</h2>
          <FileUpload />
        </div>
      </div>
    </div>
  );
};
