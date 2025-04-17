
import React from 'react';
import { X } from 'lucide-react';

interface DocumentViewerPanelProps {
  documentId: string;
  onClose?: () => void;
}

export const DocumentViewerPanel = ({ documentId, onClose }: DocumentViewerPanelProps) => {
  return (
    <div className="h-full flex flex-col relative">
      {onClose && (
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 p-2 rounded-full hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </button>
      )}
      
      <div className="p-4">
        <h2 className="text-xl font-semibold">Document Viewer</h2>
        <p className="text-muted-foreground">Document ID: {documentId}</p>
      </div>
      
      <div className="flex-1 p-4 flex items-center justify-center bg-muted/20">
        <p>Document content will be displayed here</p>
      </div>
    </div>
  );
};
