
import { Plus } from "lucide-react";

export const DocumentUploadButton: React.FC = () => {
  return (
    <button 
      className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      onClick={() => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.pdf,.doc,.docx';
        fileInput.click();
      }}
    >
      <Plus className="h-4 w-4 mr-2" />
      New Document
    </button>
  );
};
