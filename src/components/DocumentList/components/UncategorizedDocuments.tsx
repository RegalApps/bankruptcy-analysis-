
import { FileText } from "lucide-react";
import { Document } from "../types";

interface UncategorizedDocumentsProps {
  documents: Document[];
  onDocumentClick: (doc: Pick<Document, 'id' | 'storage_path'>) => void;
}

export const UncategorizedDocuments = ({ documents, onDocumentClick }: UncategorizedDocumentsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-4 rounded-lg border bg-card hover:border-primary/50 cursor-pointer"
            onClick={() => onDocumentClick(doc)}
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-md bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{doc.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date(doc.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm px-2 py-1 rounded-full bg-secondary">
                {doc.type || 'Other'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
