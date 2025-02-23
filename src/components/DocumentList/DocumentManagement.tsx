
import { FileUpload } from "@/components/FileUpload";
import { Header } from "./Header";
import { SearchBar } from "./SearchBar";
import { DocumentList } from "./DocumentList";
import { DocumentUploadButton } from "./DocumentUploadButton";
import { TreeView } from "./TreeView";
import { useDocuments } from "./hooks/useDocuments";

interface DocumentManagementProps {
  onDocumentSelect: (id: string) => void;
}

export const DocumentManagement: React.FC<DocumentManagementProps> = ({ onDocumentSelect }) => {
  const { documents, treeData, isLoading, searchQuery, setSearchQuery } = useDocuments();

  return (
    <>
      <Header />
      <div className="grid gap-6 grid-cols-[300px,1fr]">
        <aside className="h-[calc(100vh-6rem)] border-r">
          <div className="p-4 space-y-4">
            <SearchBar 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <TreeView 
              data={treeData} 
              onSelect={onDocumentSelect}
              searchQuery={searchQuery}
            />
          </div>
        </aside>

        <main className="space-y-6">
          <div className="flex justify-end px-4">
            <DocumentUploadButton />
          </div>
          
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 px-4">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i}
                  className="h-[120px] rounded-lg border bg-card animate-pulse"
                />
              ))}
            </div>
          ) : (
            <DocumentList 
              documents={documents}
              searchQuery={searchQuery}
              onDocumentSelect={onDocumentSelect}
            />
          )}

          <div className="fixed bottom-6 right-6">
            <div className="rounded-lg border bg-card p-4">
              <h2 className="text-lg font-semibold mb-4">Upload Documents</h2>
              <FileUpload />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};
