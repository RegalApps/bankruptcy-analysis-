
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DocumentPreview } from "@/components/DocumentViewer/DocumentPreview";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    id: string;
    title: string;
    storage_path: string;
  } | null;
}

const PreviewDialog: React.FC<PreviewDialogProps> = ({ isOpen, onClose, document }) => {
  if (!document) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-medium truncate pr-8">
            {document.title}
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden mt-4">
          <DocumentPreview 
            storagePath={document.storage_path} 
            documentId={document.id}
            title={document.title}
            onAnalysisComplete={() => {
              // Refresh document list or perform other actions after analysis
              console.log("Document analysis completed");
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewDialog;
