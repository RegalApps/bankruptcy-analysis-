
import { FileUpload } from "@/components/FileUpload";
import { useState } from "react";
import { useDocuments } from "./hooks/useDocuments";
import { cn } from "@/lib/utils";
import { Toolbar } from "./components/Toolbar";
import { Sidebar } from "./components/Sidebar";
import { FolderCard } from "./components/FolderCard";

interface DocumentManagementProps {
  onDocumentSelect: (id: string) => void;
}

export const DocumentManagement: React.FC<DocumentManagementProps> = ({ onDocumentSelect }) => {
  const { documents, treeData, isLoading, searchQuery, setSearchQuery } = useDocuments();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isGridView, setIsGridView] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  // Group documents by client
  const groupedByClient = documents.reduce((acc, doc) => {
    const clientName = doc.metadata?.client_name || 'Uncategorized';
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

  return (
    <>
      <div className="flex h-[calc(100vh-4rem)]">
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
            />

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
            ) : (
              <div className={cn(
                "grid gap-4",
                isGridView ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              )}>
                {Object.entries(groupedByClient)
                  .filter(([clientName]) => 
                    !searchQuery || 
                    clientName.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(([clientName, folderData]) => (
                    <FolderCard
                      key={clientName}
                      clientName={clientName}
                      isSelected={selectedFolder === clientName}
                      documentsCount={folderData.documents.length}
                      lastUpdated={folderData.lastUpdated}
                      types={folderData.types}
                      onSelect={() => setSelectedFolder(clientName)}
                      isGridView={isGridView}
                    />
                  ))}
              </div>
            )}
          </div>
        </main>

        <div className="fixed bottom-6 right-6">
          <div className="rounded-lg border bg-card p-4 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Upload Documents</h2>
            <FileUpload />
          </div>
        </div>
      </div>
    </>
  );
};
