
import { useState } from 'react';
import { Search, File, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Document } from '@/components/DocumentList/types';

interface DocumentSearchProps {
  onDocumentSelect: (document: Document) => void;
}

export const DocumentSearch = ({ onDocumentSelect }: DocumentSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample documents - in a real app, these would come from an API or database
  const mockDocuments: Document[] = [
    { id: '1', name: 'Annual Report 2025', type: 'PDF', size: 2.4, lastModified: new Date() },
    { id: '2', name: 'Tax Filing Q4 2024', type: 'PDF', size: 1.8, lastModified: new Date() },
    { id: '3', name: 'Client Statement - March 2025', type: 'DOCX', size: 0.9, lastModified: new Date() },
    { id: '4', name: 'Form 47 - Client A', type: 'PDF', size: 3.2, lastModified: new Date() },
    { id: '5', name: 'Financial Statements 2024', type: 'XLSX', size: 1.5, lastModified: new Date() },
  ];

  const filteredDocuments = mockDocuments.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText className="h-4 w-4 text-red-500" />;
      case 'DOCX': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'XLSX': return <FileText className="h-4 w-4 text-green-500" />;
      default: return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search documents..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ScrollArea className="h-[250px]">
        <div className="space-y-2">
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((doc) => (
              <Button
                key={doc.id}
                variant="ghost"
                className="w-full justify-start p-2 h-auto text-left"
                onClick={() => onDocumentSelect(doc)}
              >
                <div className="flex items-center gap-3">
                  {getFileIcon(doc.type)}
                  <div>
                    <div className="font-medium text-sm">{doc.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {doc.type} • {doc.size} MB
                    </div>
                  </div>
                </div>
              </Button>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No documents found matching "{searchTerm}"
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
