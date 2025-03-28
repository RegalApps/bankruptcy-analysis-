
import React from 'react';
import { Document } from '@/components/DocumentList/types';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, File, Folder, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface DocumentViewPanelProps {
  documents: Document[];
  isGridView: boolean;
  onDocumentSelect: (documentId: string) => void;
  onDocumentOpen: (documentId: string) => void;
  folderPath: { id: string, name: string }[];
  selectedDocumentId?: string;
}

export const DocumentViewPanel = ({
  documents,
  isGridView,
  onDocumentSelect,
  onDocumentOpen,
  folderPath,
  selectedDocumentId
}: DocumentViewPanelProps) => {
  if (documents.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/20 rounded-lg">
        <div className="text-center p-6">
          <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Documents Found</h3>
          <p className="text-muted-foreground max-w-md">
            This folder is empty. Upload documents or create a new folder to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {folderPath.length > 0 && (
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          {folderPath.map((folder, index) => (
            <React.Fragment key={folder.id}>
              <span className="hover:text-foreground cursor-pointer">
                {folder.name}
              </span>
              {index < folderPath.length - 1 && (
                <ChevronRight className="h-4 w-4 mx-1" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      <div className={`grid gap-4 ${isGridView ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {documents.map((document) => (
          <Card 
            key={document.id}
            className={`cursor-pointer transition-shadow hover:shadow-md ${
              selectedDocumentId === document.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onDocumentSelect(document.id)}
            onDoubleClick={() => onDocumentOpen(document.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded">
                  {document.type?.includes('pdf') ? (
                    <FileText className="h-8 w-8 text-primary" />
                  ) : (
                    <File className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm mb-1 truncate">{document.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {document.type || 'Unknown Type'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Updated {format(new Date(document.updated_at), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
