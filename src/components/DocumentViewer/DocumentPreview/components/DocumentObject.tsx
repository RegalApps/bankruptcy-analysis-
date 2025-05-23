
import { useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
import logger from "@/utils/logger";

interface DocumentObjectProps {
  publicUrl: string;
  onError?: () => void;
}

export const DocumentObject: React.FC<DocumentObjectProps> = ({ 
  publicUrl, 
  onError 
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const handleError = () => {
    logger.error('Error loading document in iframe');
    setLoadError("The document couldn't be displayed. It may be in an unsupported format or inaccessible.");
    if (onError) onError();
  };

  // Cache-bust the URL to ensure fresh content
  const cacheBustedUrl = `${publicUrl}?t=${Date.now()}`;

  return (
    <div className="relative w-full rounded-md overflow-hidden border">
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/10 z-10">
          <div className="bg-destructive/10 border border-destructive/30 p-4 rounded-md max-w-md text-center space-y-3">
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto" />
            <p className="text-sm font-medium">{loadError}</p>
            <p className="text-xs text-muted-foreground">
              Try downloading the document directly if you need to view its contents.
            </p>
          </div>
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        className="w-full h-[70vh] border-0"
        title="Document Preview"
        src={cacheBustedUrl}
        onError={handleError}
      />
    </div>
  );
};
