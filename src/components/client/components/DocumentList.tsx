
import { FileText, ArrowUpRight, FileImage, FileSpreadsheet, FileText as FileTextIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Document } from "../types";
import { cn } from "@/lib/utils";

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
  // Get appropriate icon for document type
  const getDocumentIcon = (doc: Document) => {
    const type = doc.type?.toLowerCase() || '';
    const title = doc.title?.toLowerCase() || '';
    
    // Special icon for Form 47
    if (isForm47Document(doc)) {
      return <FileText className={`${viewMode === 'grid' ? 'h-8 w-8' : 'h-5 w-5'} text-primary font-bold`} />;
    }
    
    if (type.includes('excel') || type.includes('spreadsheet') || title.includes('excel') || title.includes('.xls')) {
      return <FileSpreadsheet className={`${viewMode === 'grid' ? 'h-8 w-8' : 'h-5 w-5'} text-emerald-500`} />;
    }
    
    if (type.includes('image') || type.includes('png') || type.includes('jpg') || 
        title.includes('.png') || title.includes('.jpg') || title.includes('.jpeg')) {
      return <FileImage className={`${viewMode === 'grid' ? 'h-8 w-8' : 'h-5 w-5'} text-blue-500`} />;
    }
    
    return <FileText className={`${viewMode === 'grid' ? 'h-8 w-8' : 'h-5 w-5'} text-amber-500`} />;
  };

  // Handle document opening with special handling for Form 47
  const handleOpenDocument = (doc: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Opening document:", doc.id, doc.title);
    
    // Pass the actual document ID directly to ensure consistent document viewing
    onDocumentOpen(doc.id);
  };

  // Helper function to check if document is Form 47
  const isForm47Document = (doc: Document): boolean => {
    return doc.title.toLowerCase().includes('form 47') || 
           doc.title.toLowerCase().includes('consumer proposal') ||
           doc.type?.toLowerCase() === 'form-47' || 
           doc.metadata?.formType === 'form-47' ||
           doc.form_type === 'form-47';
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

  // Sort documents to prioritize Form 47
  const sortedDocuments = [...documents].sort((a, b) => {
    const aIsForm47 = isForm47Document(a);
    const bIsForm47 = isForm47Document(b);
    
    if (aIsForm47 && !bIsForm47) return -1;
    if (!aIsForm47 && bIsForm47) return 1;
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });

  // Grid view
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {sortedDocuments.map((doc) => (
          <Card 
            key={doc.id} 
            className={cn(
              "hover:shadow-md cursor-pointer transition-all",
              selectedDocumentId === doc.id ? "ring-2 ring-primary" : "",
              isForm47Document(doc) ? "bg-primary/5" : ""
            )}
            onClick={() => onDocumentSelect(doc.id)}
            onDoubleClick={() => onDocumentOpen(doc.id)}
          >
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="mb-3 mt-2">
                {getDocumentIcon(doc)}
              </div>
              <p className="font-medium text-sm mb-1 line-clamp-2">
                {isForm47Document(doc) && <span className="text-primary">●</span>} {doc.title}
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                {new Date(doc.updated_at).toLocaleDateString()}
              </p>
              <Button 
                size="sm" 
                className={cn("w-full mt-auto", isForm47Document(doc) ? "bg-primary" : "")}
                onClick={(e) => handleOpenDocument(doc, e)}
              >
                <ArrowUpRight className="h-4 w-4 mr-1" />
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
    <div className="space-y-2">
      {sortedDocuments.map((doc) => (
        <Card 
          key={doc.id} 
          className={cn(
            "hover:shadow-sm cursor-pointer transition-shadow",
            selectedDocumentId === doc.id ? "bg-primary/5 border-primary/30" : "",
            isForm47Document(doc) ? "bg-primary/5" : ""
          )}
          onClick={() => onDocumentSelect(doc.id)}
          onDoubleClick={() => onDocumentOpen(doc.id)}
        >
          <CardContent className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {getDocumentIcon(doc)}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {isForm47Document(doc) && <span className="text-primary mr-1">●</span>}
                  {doc.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  Last modified: {new Date(doc.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button 
              size="sm" 
              variant={isForm47Document(doc) ? "default" : "ghost"}
              onClick={(e) => handleOpenDocument(doc, e)}
            >
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
