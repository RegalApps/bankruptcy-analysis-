
import { DocumentCard } from "@/components/DocumentCard";

interface DocumentListProps {
  documents: any[];
  searchQuery: string;
  onDocumentSelect: (id: string) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({ 
  documents, 
  searchQuery, 
  onDocumentSelect 
}) => {
  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {filteredDocuments.length > 0 ? (
        filteredDocuments.map((doc) => (
          <DocumentCard
            key={doc.id}
            title={doc.title}
            type={doc.type}
            date={`Updated ${new Date(doc.updated_at).toLocaleDateString()}`}
            onClick={() => onDocumentSelect(doc.id)}
          />
        ))
      ) : (
        <div className="col-span-2 text-center py-8 text-muted-foreground">
          {documents.length === 0 ? (
            "No documents yet. Upload your first document!"
          ) : (
            "No documents match your search."
          )}
        </div>
      )}
    </div>
  );
};
