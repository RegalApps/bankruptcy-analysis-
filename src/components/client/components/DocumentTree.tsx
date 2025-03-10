
import { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder } from 'lucide-react';
import { Document } from '../types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DocumentTreeProps {
  documents: Document[];
  onDocumentSelect: (documentId: string) => void;
}

interface Category {
  name: string;
  documents: Document[];
}

export const DocumentTree = ({ documents, onDocumentSelect }: DocumentTreeProps) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Forms': true,
    'Financials': false,
    'Legal Docs': false,
    'Contracts': false,
    'Other': false,
  });

  // Function to categorize documents
  const categorizeDocuments = (docs: Document[]): Record<string, Document[]> => {
    const categories: Record<string, Document[]> = {
      'Forms': [],
      'Financials': [],
      'Legal Docs': [],
      'Contracts': [],
      'Other': [],
    };

    docs.forEach(doc => {
      // Extract category from document metadata or type
      const metadata = doc.metadata as Record<string, any> || {};
      const title = doc.title?.toLowerCase() || '';
      const type = doc.type?.toLowerCase() || '';
      
      if (metadata.formType || metadata.formNumber || title.includes('form') || title.includes('consumer proposal')) {
        categories['Forms'].push(doc);
      } else if (title.includes('financ') || title.includes('statement') || title.includes('income') || title.includes('expense')) {
        categories['Financials'].push(doc);
      } else if (title.includes('legal') || title.includes('court') || title.includes('case')) {
        categories['Legal Docs'].push(doc);
      } else if (title.includes('contract') || title.includes('agreement')) {
        categories['Contracts'].push(doc);
      } else {
        categories['Other'].push(doc);
      }
    });

    // Filter out empty categories
    return Object.fromEntries(
      Object.entries(categories).filter(([_, docs]) => docs.length > 0)
    );
  };

  const categorizedDocs = categorizeDocuments(documents);
  
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <ScrollArea className="h-[calc(100%-2rem)]">
      <div className="space-y-1">
        {Object.entries(categorizedDocs).map(([category, docs]) => (
          <div key={category} className="space-y-1">
            <button
              className="flex items-center w-full text-left text-sm p-1.5 rounded-md hover:bg-muted"
              onClick={() => toggleCategory(category)}
            >
              {expandedCategories[category] ? (
                <ChevronDown className="h-4 w-4 mr-1.5 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-1.5 text-muted-foreground" />
              )}
              <Folder className="h-4 w-4 mr-1.5 text-muted-foreground" />
              <span className="font-medium">{category}</span>
              <span className="ml-auto text-xs text-muted-foreground">{docs.length}</span>
            </button>
            
            {expandedCategories[category] && (
              <div className="ml-7 space-y-1">
                {docs.map(doc => (
                  <button
                    key={doc.id}
                    className="flex items-center w-full text-left text-sm p-1.5 rounded-md hover:bg-muted"
                    onClick={() => onDocumentSelect(doc.id)}
                  >
                    <File className="h-4 w-4 mr-1.5 text-muted-foreground" />
                    <span className="truncate">{doc.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {Object.keys(categorizedDocs).length === 0 && (
          <div className="text-sm text-muted-foreground py-2 text-center">
            No documents to display
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
