
import React, { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

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
  const [loading, setLoading] = useState(true);
  
  // Reset load status when URL changes
  useEffect(() => {
    setContentLoaded(false);
    setLoadAttempts(0);
    setLoading(true);
  }, [publicUrl]);
  
  const handleLoad = () => {
    console.log("Document loaded successfully:", publicUrl);
    setContentLoaded(true);
    setLoading(false);
  };
  
  const handleError = () => {
    console.error("Error loading document from URL:", publicUrl);
    setLoadAttempts(prev => prev + 1);
    setLoading(false);
    onError();
  };

  // Try an alternative viewer after multiple failures
  const useAlternativeViewer = loadAttempts >= 2 && !contentLoaded;

  return (
    <div className="aspect-[3/4] w-full bg-muted rounded-lg overflow-hidden relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">Loading document...</p>
          </div>
        </div>
      )}
      
      {loadAttempts > 0 && !contentLoaded && (
        <Alert className="mb-4 bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-sm text-yellow-700">
            Having trouble loading the document. Attempt {loadAttempts} of 3.
            {loadAttempts >= 3 && " Please try downloading the document instead."}
          </AlertDescription>
        </Alert>
      )}
      
      {useAlternativeViewer ? (
        <div className="p-4">
          <div className="p-4 text-center border rounded-lg">
            <h3 className="font-medium mb-2">Standard viewer failed to load document</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We're having trouble displaying this document in the standard viewer.
            </p>
            <div className="space-y-2">
              <Button asChild variant="default" className="w-full">
                <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                  Open in New Tab
                </a>
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setLoadAttempts(0)}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
};
