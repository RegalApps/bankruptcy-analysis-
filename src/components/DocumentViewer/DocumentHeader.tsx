
import React from 'react';
import { FileText, Calendar, User, Archive } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DocumentHeaderProps {
  title: string;
  documentId: string;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  title,
  documentId,
  metadata,
  createdAt,
  updatedAt
}) => {
  return (
    <div className="p-4 border-b bg-muted/40">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold truncate">{title}</h2>
      </div>
      
      <div className="flex items-center text-xs text-muted-foreground gap-4">
        <div className="flex items-center gap-1">
          <Archive className="h-3.5 w-3.5" />
          <span className="truncate max-w-[120px]">{documentId}</span>
        </div>
        
        {createdAt && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>Created {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
          </div>
        )}
        
        {metadata?.client_name && (
          <div className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            <span>{metadata.client_name}</span>
          </div>
        )}
      </div>
    </div>
  );
};
