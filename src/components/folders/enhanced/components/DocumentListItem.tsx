
import { FileText, File, DollarSign } from "lucide-react";
import { Document } from "@/components/DocumentList/types";

interface DocumentListProps {
  documents: Document[];
  indentationLevel: number;
  onDocumentSelect: (documentId: string) => void;
  onDocumentOpen: (documentId: string) => void;
  handleDragStart: (id: string, type: 'folder' | 'document') => void;
}

export const DocumentListItem = ({
  documents,
  indentationLevel,
  onDocumentSelect,
  onDocumentOpen,
  handleDragStart
}: DocumentListProps) => {
  // Create indentation based on level
  const indentation = Array(indentationLevel).fill(0).map((_, i) => (
    <div key={i} className="w-6" />
  ));

  // Get icon based on document type
  const getDocumentIcon = (doc: Document) => {
    const formType = doc.metadata?.formType;
    const title = doc.title?.toLowerCase() || '';
    
    if (formType === 'form-47' || title.includes('form 47') || title.includes('consumer proposal')) {
      return <DollarSign className="h-4 w-4 text-green-500 mr-2" />;
    } else if (formType === 'form-76' || title.includes('form 76') || title.includes('statement of affairs')) {
      return <FileText className="h-4 w-4 text-blue-500 mr-2" />;
    } else if (title.includes('.xlsx') || title.includes('.xls') || title.includes('.csv')) {
      return <FileText className="h-4 w-4 text-amber-500 mr-2" />;
    } else {
      return <File className="h-4 w-4 text-muted-foreground mr-2" />;
    }
  };

  // Filter documents that are not folders
  const filteredDocuments = documents.filter(doc => !doc.is_folder);

  // Sort documents to show forms first, then financial documents, then others
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    const aTitle = a.title?.toLowerCase() || '';
    const bTitle = b.title?.toLowerCase() || '';
    
    // Check for form types
    const aIsForm47 = a.metadata?.formType === 'form-47' || 
                      aTitle.includes('form 47') || 
                      aTitle.includes('consumer proposal');
    const bIsForm47 = b.metadata?.formType === 'form-47' || 
                      bTitle.includes('form 47') || 
                      bTitle.includes('consumer proposal');
                      
    const aIsForm76 = a.metadata?.formType === 'form-76' || 
                      aTitle.includes('form 76') || 
                      aTitle.includes('statement of affairs');
    const bIsForm76 = b.metadata?.formType === 'form-76' || 
                      bTitle.includes('form 76') || 
                      bTitle.includes('statement of affairs');
    
    // Check for financial documents
    const aIsFinancial = aTitle.includes('.xlsx') || aTitle.includes('.xls') || aTitle.includes('.csv');
    const bIsFinancial = bTitle.includes('.xlsx') || bTitle.includes('.xls') || bTitle.includes('.csv');
    
    // Prioritize Form 47 documents
    if (aIsForm47 && !bIsForm47) return -1;
    if (!aIsForm47 && bIsForm47) return 1;
    
    // Then Form 76 documents
    if (aIsForm76 && !bIsForm76) return -1;
    if (!aIsForm76 && bIsForm76) return 1;
    
    // Then financial documents
    if (aIsFinancial && !bIsFinancial) return -1;
    if (!aIsFinancial && bIsFinancial) return 1;
    
    // Finally sort by title
    return aTitle.localeCompare(bTitle);
  });

  return (
    <div>
      {sortedDocuments.length > 0 ? (
        sortedDocuments.map(doc => {
          const title = doc.title?.toLowerCase() || '';
          const isForm47 = doc.metadata?.formType === 'form-47' || 
                          title.includes('form 47') || 
                          title.includes('consumer proposal');
          const isForm76 = doc.metadata?.formType === 'form-76' || 
                          title.includes('form 76');
          const clientName = doc.metadata?.clientName || doc.metadata?.client_name;
          
          return (
            <div 
              key={doc.id}
              className={`flex items-center py-1 px-2 hover:bg-accent/40 rounded-sm cursor-pointer
                ${isForm47 ? 'bg-green-50/30' : (isForm76 ? 'bg-blue-50/30' : '')}`}
              onClick={() => onDocumentSelect(doc.id)}
              onDoubleClick={() => onDocumentOpen(doc.id)}
              draggable
              onDragStart={() => handleDragStart(doc.id, 'document')}
              role="button"
              aria-label={`Document: ${doc.title}`}
            >
              {indentation}
              <div className="w-6" /> {/* Align with folder icon */}
              {getDocumentIcon(doc)}
              <div className="flex flex-col">
                <span className="text-sm truncate">{doc.title}</span>
                <div className="flex gap-2 items-center">
                  {clientName && (
                    <span className="text-xs text-muted-foreground">Client: {clientName}</span>
                  )}
                  {isForm47 && (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />Consumer Proposal
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="pl-6 py-2 text-sm text-muted-foreground italic">
          No documents in this folder
        </div>
      )}
    </div>
  );
};
