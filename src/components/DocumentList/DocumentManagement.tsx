import { useState } from "react";
import { useDocuments } from "./hooks/useDocuments";
import { cn } from "@/lib/utils";
import { Toolbar } from "./components/Toolbar";
import { Sidebar } from "./components/Sidebar";
import { FolderCard } from "./components/FolderCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DocumentPreview } from "@/components/DocumentViewer/DocumentPreview";
import { FileText } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";

interface DocumentManagementProps {
  onDocumentSelect?: (id: string) => void;
}

export const DocumentManagement: React.FC<DocumentManagementProps> = ({ onDocumentSelect }) => {
  const { documents, treeData, isLoading, searchQuery, setSearchQuery } = useDocuments();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isGridView, setIsGridView] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [previewDocument, setPreviewDocument] = useState<{ id: string; storage_path: string } | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = !searchQuery || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.metadata?.client_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFolder = !selectedFolder ? true : 
      selectedFolder === 'Uncategorized' 
        ? !doc.parent_folder_id && !doc.metadata?.client_name
        : doc.metadata?.client_name === selectedFolder || doc.parent_folder_id === selectedFolder;
    
    const matchesType = !filterType || doc.type === filterType;

    return matchesSearch && matchesFolder && matchesType;
  });

  const groupedByClient = filteredDocuments.reduce((acc, doc) => {
    let clientName = 'Uncategorized';
    
    if (doc.metadata?.client_name) {
      clientName = doc.metadata.client_name;
    } else if (doc.parent_folder_id) {
      const parentDoc = documents.find(d => d.id === doc.parent_folder_id);
      if (parentDoc?.metadata?.client_name) {
        clientName = parentDoc.metadata.client_name;
      }
    }

    if (!acc[clientName]) {
      acc[clientName] = {
        documents: [],
        lastUpdated: null as Date | null,
        types: new Set<string>()
      };
    }
    
    acc[clientName].documents.push(doc);
    acc[clientName].types.add(doc.type || 'Other');
    const updatedAt = new Date(doc.updated_at);
    if (!acc[clientName].lastUpdated || updatedAt > acc[clientName].lastUpdated) {
      acc[clientName].lastUpdated = updatedAt;
    }
    return acc;
  }, {} as Record<string, { 
    documents: typeof documents, 
    lastUpdated: Date | null,
    types: Set<string>
  }>);

  const renderContent = () => {
    if (selectedFolder === 'Uncategorized') {
      const uncategorizedDocs = filteredDocuments.filter(
        doc => !doc.parent_folder_id && !doc.metadata?.client_name
      );

      return (
        <div className="space-y-4">
          <div className="grid gap-4">
            {uncategorizedDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:border-primary/50 cursor-pointer"
                onClick={() => setPreviewDocument(doc)}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-md bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{doc.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Last updated: {new Date(doc.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm px-2 py-1 rounded-full bg-secondary">
                    {doc.type || 'Other'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className={cn(
        "grid gap-4",
        isGridView ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
      )}>
        {Object.entries(groupedByClient)
          .map(([clientName, folderData]) => (
            <FolderCard
              key={clientName}
              clientName={clientName}
              isSelected={selectedFolder === clientName}
              documentsCount={folderData.documents.length}
              lastUpdated={folderData.lastUpdated}
              types={folderData.types}
              onSelect={() => setSelectedFolder(clientName)}
              onDocumentClick={(doc) => setPreviewDocument(doc)}
              documents={folderData.documents}
              isGridView={isGridView}
            />
          ))}
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        groupedByClient={groupedByClient}
        selectedFolder={selectedFolder}
        setSelectedFolder={setSelectedFolder}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <Toolbar
            selectedFolder={selectedFolder}
            isGridView={isGridView}
            setIsGridView={setIsGridView}
            onFilterChange={setFilterType}
            currentFilter={filterType}
          />

          <ScrollArea className="h-[calc(100vh-14rem)]">
            {isLoading ? (
              <div className={cn(
                "grid gap-4",
                isGridView ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              )}>
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i}
                    className="h-[200px] rounded-lg border bg-card animate-pulse"
                  />
                ))}
              </div>
            ) : renderContent()}
          </ScrollArea>
        </div>
      </main>

      <Dialog 
        open={!!previewDocument} 
        onOpenChange={() => setPreviewDocument(null)}
      >
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
          </DialogHeader>
          {previewDocument && (
            <div className="flex-1 overflow-hidden">
              <DocumentPreview 
                storagePath={previewDocument.storage_path}
                onAnalysisComplete={() => {
                  setPreviewDocument(null);
                  if (onDocumentSelect) {
                    onDocumentSelect(previewDocument.id);
                  }
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
