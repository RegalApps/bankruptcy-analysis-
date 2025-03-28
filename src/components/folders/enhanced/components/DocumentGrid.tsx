
import { FileText, FileImage, FileSpreadsheet } from "lucide-react";
import { Document } from "@/components/DocumentList/types";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DocumentGridProps {
  documents: Document[];
  onDocumentSelect: (documentId: string) => void;
  onDocumentOpen: (documentId: string) => void;
  selectedDocumentId: string | null;
}

export const DocumentGrid: React.FC<DocumentGridProps> = ({
  documents,
  onDocumentSelect,
  onDocumentOpen,
  selectedDocumentId
}) => {
  // Get appropriate icon for document type
  const getDocumentIcon = (doc: Document) => {
    const type = doc.type?.toLowerCase() || '';
    const title = doc.title?.toLowerCase() || '';
    
    if (type.includes('excel') || type.includes('spreadsheet') || title.includes('excel') || title.includes('.xls')) {
      return <FileSpreadsheet className="h-10 w-10 text-emerald-500" />;
    }
    
    if (type.includes('image') || type.includes('png') || type.includes('jpg') || 
        title.includes('.png') || title.includes('.jpg') || title.includes('.jpeg')) {
      return <FileImage className="h-10 w-10 text-blue-500" />;
    }
    
    return <FileText className="h-10 w-10 text-amber-500" />;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2">
      {documents.map(doc => (
        <Card 
          key={doc.id}
          className={cn(
            "cursor-pointer transition-shadow hover:shadow-md",
            selectedDocumentId === doc.id ? "ring-2 ring-primary" : ""
          )}
          onClick={() => onDocumentSelect(doc.id)}
          onDoubleClick={() => onDocumentOpen(doc.id)}
        >
          <CardContent className="p-4 flex flex-col items-center text-center">
            <div className="mb-3 mt-2">
              {getDocumentIcon(doc)}
            </div>
            <h3 className="font-medium text-sm mb-1 line-clamp-2">
              {doc.title}
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              {doc.type || 'Document'} • {new Date(doc.updated_at).toLocaleDateString()}
            </p>
            <Button 
              size="sm" 
              className="w-full mt-auto"
              onClick={(e) => {
                e.stopPropagation();
                onDocumentOpen(doc.id);
              }}
            >
              Open
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
