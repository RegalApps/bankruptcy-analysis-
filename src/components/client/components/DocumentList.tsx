
import { FileText, ArrowUpRight, FileImage, FileSpreadsheet, FileText as FileTextIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Document } from "../types";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface DocumentListProps {
  documents: Document[];
  onDocumentOpen: (documentId: string) => void;
  onDocumentSelect: (documentId: string) => void;
  selectedDocumentId: string | null;
  viewMode: 'list' | 'grid';
}

export const DocumentList = ({ 
  documents, 
  onDocumentOpen, 
  onDocumentSelect,
  selectedDocumentId,
  viewMode
}: DocumentListProps) => {
  const isMobile = useIsMobile();
  
  // Get appropriate icon for document type
  const getDocumentIcon = (doc: Document) => {
    const type = doc.type?.toLowerCase() || '';
    const title = doc.title?.toLowerCase() || '';
    
    if (type.includes('excel') || type.includes('spreadsheet') || title.includes('excel') || title.includes('.xls')) {
      return <FileSpreadsheet className={`${viewMode === 'grid' ? 'h-8 w-8' : 'h-5 w-5'} text-emerald-500`} />;
    }
    
    if (type.includes('image') || type.includes('png') || type.includes('jpg') || 
        title.includes('.png') || title.includes('.jpg') || title.includes('.jpeg')) {
      return <FileImage className={`${viewMode === 'grid' ? 'h-8 w-8' : 'h-5 w-5'} text-blue-500`} />;
    }
    
    return <FileText className={`${viewMode === 'grid' ? 'h-8 w-8' : 'h-5 w-5'} text-amber-500`} />;
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <FileTextIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Documents Found</h3>
        <p className="text-muted-foreground">This client doesn't have any documents yet.</p>
      </div>
    );
  }

  // Grid view
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 p-2 sm:p-4">
        {documents.map((doc) => (
          <Card 
            key={doc.id} 
            className={cn(
              "hover:shadow-md cursor-pointer transition-all",
              selectedDocumentId === doc.id ? "ring-2 ring-primary" : ""
            )}
            onClick={() => onDocumentSelect(doc.id)}
            onDoubleClick={() => onDocumentOpen(doc.id)}
          >
            <CardContent className="p-3 sm:p-4 flex flex-col items-center text-center">
              <div className="mb-2 sm:mb-3 mt-1 sm:mt-2">
                {getDocumentIcon(doc)}
              </div>
              <p className="font-medium text-xs sm:text-sm mb-1 line-clamp-2">{doc.title}</p>
              <p className="text-xs text-muted-foreground mb-2 sm:mb-3">
                {new Date(doc.updated_at).toLocaleDateString()}
              </p>
              <Button 
                size="sm" 
                className="w-full mt-auto text-xs sm:text-sm px-2 sm:px-3"
                onClick={(e) => {
                  e.stopPropagation();
                  onDocumentOpen(doc.id);
                }}
              >
                <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Open
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // List view (default)
  return (
    <div className="space-y-2 p-2 sm:p-4">
      {documents.map((doc) => (
        <Card 
          key={doc.id} 
          className={cn(
            "hover:shadow-sm cursor-pointer transition-shadow",
            selectedDocumentId === doc.id ? "bg-primary/5 border-primary/30" : ""
          )}
          onClick={() => onDocumentSelect(doc.id)}
          onDoubleClick={() => onDocumentOpen(doc.id)}
        >
          <CardContent className="p-2 sm:p-3 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              {getDocumentIcon(doc)}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-xs sm:text-sm">{doc.title}</p>
                <p className="text-xs text-muted-foreground hidden xs:block">
                  Last modified: {new Date(doc.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onDocumentOpen(doc.id);
              }}
            >
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
