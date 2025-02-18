
import { supabase } from "@/lib/supabase";
import { DocumentDetails } from "./types";

interface DocumentPreviewProps {
  document: DocumentDetails;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ document }) => {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Document Preview</h3>
        <a 
          href={`${supabase.storage.from('documents').getPublicUrl(document.storage_path).data.publicUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline"
        >
          Open Document
        </a>
      </div>
      
      <div className="aspect-[3/4] w-full bg-muted rounded-lg">
        <iframe
          src={`${supabase.storage.from('documents').getPublicUrl(document.storage_path).data.publicUrl}`}
          className="w-full h-full rounded-lg"
          title="Document Preview"
        />
      </div>
    </div>
  );
};
