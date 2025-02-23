
import { FileUpload } from "@/components/FileUpload";
import { Header } from "./Header";
import { SearchBar } from "./SearchBar";
import { DocumentList } from "./DocumentList";
import { DocumentUploadButton } from "./DocumentUploadButton";
import { useDocuments } from "./hooks/useDocuments";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { File, Folder, Users } from "lucide-react";
import { DocumentNode } from "./types";

interface DocumentManagementProps {
  onDocumentSelect: (id: string) => void;
}

export const DocumentManagement: React.FC<DocumentManagementProps> = ({ onDocumentSelect }) => {
  const { documents, treeData, isLoading, searchQuery, setSearchQuery } = useDocuments();

  const renderDropdownContent = (nodes: DocumentNode[], level = 0) => {
    return nodes.map((node) => {
      if (node.children && node.children.length > 0) {
        return (
          <SelectGroup key={node.id}>
            <SelectLabel className="flex items-center gap-2">
              {node.type === 'client' ? (
                <Users className="h-4 w-4" />
              ) : (
                <Folder className="h-4 w-4" />
              )}
              {node.title}
            </SelectLabel>
            {renderDropdownContent(node.children, level + 1)}
          </SelectGroup>
        );
      }
      return (
        <SelectItem 
          key={node.id} 
          value={node.id}
          className="flex items-center gap-2"
        >
          <File className="h-4 w-4" />
          {node.title}
        </SelectItem>
      );
    });
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex gap-4 items-center">
          <div className="w-[300px]">
            <Select onValueChange={onDocumentSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select a document" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {renderDropdownContent(treeData)}
              </SelectContent>
            </Select>
          </div>
          <SearchBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <div className="ml-auto">
            <DocumentUploadButton />
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
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
      </div>
    </>
  );
};
