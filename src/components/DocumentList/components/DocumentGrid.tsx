
import { cn } from "@/lib/utils";
import { FolderCard } from "./FolderCard";
import { Document } from "../types";

interface DocumentGridProps {
  isGridView: boolean;
  groupedByClient: Record<string, {
    documents: Document[];
    lastUpdated: Date | null;
    types: Set<string>;
  }>;
  selectedFolder: string | null;
  onFolderSelect: (folder: string) => void;
  onDocumentClick: (doc: Pick<Document, 'id' | 'storage_path'>) => void;
}

export const DocumentGrid = ({
  isGridView,
  groupedByClient,
  selectedFolder,
  onFolderSelect,
  onDocumentClick
}: DocumentGridProps) => {
  return (
    <div className={cn(
      "grid gap-4",
      isGridView ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
    )}>
      {Object.entries(groupedByClient).map(([clientName, folderData]) => (
        <FolderCard
          key={clientName}
          clientName={clientName}
          isSelected={selectedFolder === clientName}
          documentsCount={folderData.documents.length}
          lastUpdated={folderData.lastUpdated}
          types={folderData.types}
          onSelect={() => onFolderSelect(clientName)}
          onDocumentClick={onDocumentClick}
          documents={folderData.documents}
          isGridView={isGridView}
        />
      ))}
    </div>
  );
};
