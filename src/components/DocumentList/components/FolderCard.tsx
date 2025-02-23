
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Folder, Plus, SlidersHorizontal, Users, FileText, Eye } from "lucide-react";
import type { Document } from "../types";

interface FolderCardProps {
  clientName: string;
  isSelected: boolean;
  documentsCount: number;
  lastUpdated: Date | null;
  types: Set<string>;
  onSelect: () => void;
  onDocumentClick: (document: Pick<Document, 'id' | 'storage_path'>) => void;
  documents: Document[];
  isGridView: boolean;
}

export const FolderCard = ({
  clientName,
  isSelected,
  documentsCount,
  lastUpdated,
  types,
  onSelect,
  onDocumentClick,
  documents,
  isGridView
}: FolderCardProps) => {
  return (
    <div 
      className={cn(
        "p-4 rounded-lg border bg-card transition-all",
        "hover:shadow-md hover:border-primary/50",
        isSelected && "border-primary shadow-md",
        isGridView ? "h-[200px]" : "h-auto"
      )}
    >
      <div className="flex items-start justify-between">
        <div 
          className="flex items-center space-x-3 cursor-pointer"
          onClick={onSelect}
        >
          <div className={cn(
            "p-2 rounded-md",
            isSelected ? "bg-primary/20" : "bg-primary/10"
          )}>
            <Folder className={cn(
              "h-6 w-6",
              isSelected ? "text-primary" : "text-primary/70"
            )} />
          </div>
          <div>
            <h3 className="font-medium">{clientName}</h3>
            <p className="text-sm text-muted-foreground">
              {documentsCount} document{documentsCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Plus className="h-4 w-4 mr-2" />
              Add Document
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Users className="h-4 w-4 mr-2" />
              Share Folder
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Delete Folder
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isSelected && (
        <ScrollArea className="mt-4 h-[100px]">
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                onClick={() => onDocumentClick(doc)}
              >
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm truncate">{doc.title}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      <div className="mt-4 space-y-2">
        <div className="flex flex-wrap gap-2">
          {Array.from(types).map(type => (
            <span 
              key={type}
              className="inline-flex items-center px-2 py-1 rounded-full bg-secondary text-secondary-foreground text-xs"
            >
              {type}
            </span>
          ))}
        </div>
        {lastUpdated && (
          <p className="text-xs text-muted-foreground">
            Last updated: {lastUpdated.toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};
