
import { supabase } from "@/lib/supabase";

interface DocumentPreviewProps {
  storagePath: string;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ storagePath }) => {
  const publicUrl = supabase.storage.from('documents').getPublicUrl(storagePath).data.publicUrl;

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Document Preview</h3>
        <a 
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline"
        >
          Open Document
        </a>
      </div>
      
      <div className="aspect-[3/4] w-full bg-muted rounded-lg">
        <iframe
          src={publicUrl}
          className="w-full h-full rounded-lg"
          title="Document Preview"
        />
      </div>
    </div>
  );
};
