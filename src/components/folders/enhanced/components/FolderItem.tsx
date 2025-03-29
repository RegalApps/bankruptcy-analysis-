
import React from "react";
import { Document } from "@/components/client/types";
import { Card, CardContent } from "@/components/ui/card";
import { Folder, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface FolderItemProps {
  folder: Document;
  onDocumentOpen?: (documentId: string) => void;
}

export const FolderItem = ({ folder, onDocumentOpen }: FolderItemProps) => {
  // Ensure the folder has necessary properties
  if (!folder || !folder.id || !folder.title) {
    return null;
  }

  const handleOpen = () => {
    if (onDocumentOpen) {
      onDocumentOpen(folder.id);
    }
  };

  return (
    <Card 
      className={cn(
        "relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer h-[120px]",
        "border-muted-foreground/20"
      )}
      onClick={handleOpen}
    >
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center">
            <Folder className="h-5 w-5 mr-2 text-primary" />
            <h3 className="font-medium truncate">{folder.title}</h3>
          </div>
          <Eye 
            className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              handleOpen();
            }}
          />
        </div>
        
        <div className="mt-auto text-xs text-muted-foreground">
          {new Date(folder.created_at).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};
