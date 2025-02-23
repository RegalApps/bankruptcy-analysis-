
import { DocumentPreview } from "@/components/DocumentViewer/DocumentPreview";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

interface PreviewDialogProps {
  document: { id: string; storage_path: string } | null;
  onClose: () => void;
  onAnalysisComplete: (id: string) => void;
}

export const PreviewDialog = ({ document, onClose, onAnalysisComplete }: PreviewDialogProps) => {
  return (
    <Dialog open={!!document} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Document Preview</DialogTitle>
        </DialogHeader>
        {document && (
          <div className="flex-1 overflow-hidden">
            <DocumentPreview
              storagePath={document.storage_path}
              onAnalysisComplete={() => {
                onClose();
                onAnalysisComplete(document.id);
              }}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
