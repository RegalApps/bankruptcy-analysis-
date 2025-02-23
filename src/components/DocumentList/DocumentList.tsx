
import { DocumentCard } from "@/components/DocumentCard";

interface Document {
  id: string;
  title: string;
  type: string;
  updated_at: string;
  storage_path: string;
  size: number;
}

interface DocumentListProps {
  documents: Document[];
  searchQuery: string;
  onDocumentSelect: (id: string) => void;
  viewMode?: "grid" | "list";
}

export const DocumentList: React.FC<DocumentListProps> = ({ 
  documents, 
  searchQuery, 
  onDocumentSelect,
  viewMode = "grid"
}) => {
  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group documents by type
  const groupedDocuments = filteredDocuments.reduce((acc, doc) => {
    const type = doc.type || 'Other';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  if (filteredDocuments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {documents.length === 0 ? (
          "No documents yet. Upload your first document!"
        ) : (
          "No documents match your search."
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedDocuments).map(([type, docs]) => (
        <div key={type} className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">{type}</h3>
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {docs.map((doc) => (
              <DocumentCard
                key={doc.id}
                title={doc.title}
                type={doc.type}
                date={`Updated ${new Date(doc.updated_at).toLocaleDateString()}`}
                onClick={() => onDocumentSelect(doc.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
