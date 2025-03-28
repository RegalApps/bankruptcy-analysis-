
import { FileText, FileImage, FileSpreadsheet } from "lucide-react";
import { Document } from "@/components/DocumentList/types";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface DocumentTableProps {
  documents: Document[];
  onDocumentSelect: (documentId: string) => void;
  onDocumentOpen: (documentId: string) => void;
  selectedDocumentId: string | null;
}

export const DocumentTable: React.FC<DocumentTableProps> = ({
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
      return <FileSpreadsheet className="h-4 w-4 text-emerald-500" />;
    }
    
    if (type.includes('image') || type.includes('png') || type.includes('jpg') || 
        title.includes('.png') || title.includes('.jpg') || title.includes('.jpeg')) {
      return <FileImage className="h-4 w-4 text-blue-500" />;
    }
    
    return <FileText className="h-4 w-4 text-amber-500" />;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Last Modified</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map(doc => (
          <TableRow 
            key={doc.id}
            className={cn(
              "cursor-pointer",
              selectedDocumentId === doc.id ? "bg-primary/10" : ""
            )}
            onClick={() => onDocumentSelect(doc.id)}
          >
            <TableCell className="font-medium">
              <div className="flex items-center">
                {getDocumentIcon(doc)}
                <span className="ml-2">{doc.title}</span>
              </div>
            </TableCell>
            <TableCell>{doc.type || "Document"}</TableCell>
            <TableCell>{new Date(doc.updated_at).toLocaleDateString()}</TableCell>
            <TableCell className="text-right">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDocumentOpen(doc.id);
                }}
              >
                Open
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
