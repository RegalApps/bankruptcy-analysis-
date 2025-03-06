import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileIcon, FileTextIcon, FolderIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface DocumentGridProps {
  isGridView: boolean;
  groupedByClient: Record<string, { 
    documents: any[], 
    lastUpdated: Date | null,
    types: Set<string>
  }>;
  selectedFolder: string | null;
  onFolderSelect: (folder: string | null) => void;
  onDocumentClick: (document: { id: string; title: string; storage_path: string }) => void;
}

export const DocumentGrid: React.FC<DocumentGridProps> = ({
  isGridView,
  groupedByClient,
  selectedFolder,
  onFolderSelect,
  onDocumentClick
}) => {
  const renderFolder = (clientName: string, documents: any[], lastUpdated: Date | null, types: Set<string>) => {
    const isSelected = selectedFolder === clientName;
    const Icon = types.size > 1 ? FileIcon : FileTextIcon;

    return (
      <Card
        key={clientName}
        className={cn(
          "cursor-pointer hover:bg-accent/10 transition-colors",
          isSelected ? "bg-accent/20" : ""
        )}
        onClick={() => onFolderSelect(clientName)}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <FolderIcon className="h-4 w-4 mr-1 text-muted-foreground" />
            {clientName}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground py-0">
          {documents.length} Documents
        </CardContent>
        {lastUpdated && (
          <CardFooter className="text-xs text-muted-foreground py-1">
            Updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
          </CardFooter>
        )}
      </Card>
    );
  };

  const renderDocument = (doc: any) => {
    return (
      <Card 
        key={doc.id} 
        className="cursor-pointer hover:bg-accent/10 transition-colors"
        onClick={() => onDocumentClick({
          id: doc.id,
          title: doc.title,
          storage_path: doc.storage_path
        })}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <FileIcon className="h-4 w-4 mr-1 text-muted-foreground" />
            {doc.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground py-0">
          {doc.type}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground py-1">
          Updated {formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true })}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {Object.entries(groupedByClient).length === 0 ? (
        <div className="text-center p-8 text-muted-foreground">
          No documents found.
        </div>
      ) : (
        Object.entries(groupedByClient).map(([clientName, { documents, lastUpdated, types }]) => (
          <div key={clientName} className="space-y-2">
            <h2 className="text-lg font-medium">{clientName}</h2>
            <div
              className={cn(
                "grid gap-4",
                isGridView ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              )}
            >
              {documents.map(doc =>
                renderDocument(doc)
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
