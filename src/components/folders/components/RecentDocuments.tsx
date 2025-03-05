
import { Document } from "@/components/DocumentList/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RecentDocumentsProps {
  documents: Document[];
  onOpenDocument?: (documentId: string) => void;
}

export const RecentDocuments = ({ documents, onOpenDocument }: RecentDocumentsProps) => {
  // Filter for non-folder documents and sort by most recent
  const recentDocs = documents
    .filter(doc => !doc.is_folder)
    .sort((a, b) => {
      const dateA = new Date(a.updated_at || a.created_at);
      const dateB = new Date(b.updated_at || b.created_at);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5); // Get only the 5 most recent

  if (recentDocs.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="flex items-center mb-3">
        <Clock className="w-4 h-4 mr-2 text-primary" />
        <h3 className="text-sm font-medium">Recently Modified</h3>
      </div>
      <ScrollArea className="h-[120px]">
        <div className="space-y-2">
          {recentDocs.map(doc => (
            <div
              key={doc.id}
              className="flex items-center p-2 rounded-md hover:bg-accent/20 cursor-pointer"
              onClick={() => onOpenDocument && onOpenDocument(doc.id)}
            >
              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{doc.title}</p>
                <p className="text-xs text-muted-foreground">
                  {doc.updated_at 
                    ? `Updated ${formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true })}` 
                    : `Created ${formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}`
                  }
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
