
import { Document } from "@/components/DocumentList/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";

interface UncategorizedGridProps {
  documents: Document[];
}

export const UncategorizedGrid = ({ documents }: UncategorizedGridProps) => {
  return (
    <ScrollArea className="h-[400px]">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center p-4 rounded-lg glass-panel hover:shadow-lg transition-all duration-200 card-highlight"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('documentId', doc.id);
            }}
          >
            <div className="p-2 rounded-md bg-primary/10 mr-3">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">{doc.title}</h4>
              <p className="text-sm text-muted-foreground">
                {doc.type || 'Document'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
