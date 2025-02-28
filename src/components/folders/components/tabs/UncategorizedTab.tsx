
import { Document } from "@/components/DocumentList/types";
import { UncategorizedGrid } from "../UncategorizedGrid";

interface UncategorizedTabProps {
  documents: Document[];
  onDocumentSelect: (documentId: string) => void;
  onOpenDocument?: (documentId: string) => void;
}

export const UncategorizedTab = ({ 
  documents, 
  onDocumentSelect,
  onOpenDocument
}: UncategorizedTabProps) => {
  return (
    <UncategorizedGrid 
      documents={documents}
      onDocumentSelect={onDocumentSelect}
      onOpenDocument={onOpenDocument}
    />
  );
};
