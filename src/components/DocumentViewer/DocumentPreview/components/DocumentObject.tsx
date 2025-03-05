
import React, { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DocumentObjectProps {
  publicUrl: string;
  onError: () => void;
}

export const DocumentObject: React.FC<DocumentObjectProps> = ({ 
  publicUrl, 
  onError 
}) => {
  const [loadAttempts, setLoadAttempts] = useState(0);
  const [contentLoaded, setContentLoaded] = useState(false);
  
  // Reset load status when URL changes
  useEffect(() => {
    setContentLoaded(false);
    setLoadAttempts(0);
  }, [publicUrl]);
  
  const handleLoad = () => {
    console.log("Document loaded successfully:", publicUrl);
    setContentLoaded(true);
  };
  
  const handleError = () => {
    console.error("Error loading document from URL:", publicUrl);
    setLoadAttempts(prev => prev + 1);
    onError();
  };

  return (
    <div className="aspect-[3/4] w-full bg-muted rounded-lg overflow-hidden">
      {loadAttempts > 0 && !contentLoaded && (
        <Alert className="mb-4 bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-sm text-yellow-700">
            Having trouble loading the document. Attempt {loadAttempts} of 3.
            {loadAttempts >= 3 && " Please try downloading the document instead."}
          </AlertDescription>
        </Alert>
      )}
      
      <object
        data={publicUrl}
        type="application/pdf"
        className="w-full h-full rounded-lg"
        onLoad={handleLoad}
        onError={handleError}
      >
        <p className="p-4 text-center">
          Unable to display PDF. <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">Download</a> instead.
        </p>
      </object>
    </div>
  );
};
