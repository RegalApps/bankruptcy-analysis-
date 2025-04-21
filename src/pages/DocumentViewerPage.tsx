
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { DocumentViewer } from "@/components/DocumentViewer";
import { toast } from "sonner";

const DocumentViewerPage = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [documentNotFound, setDocumentNotFound] = useState(false);
  
  useEffect(() => {
    if (!documentId) {
      toast.error("No document ID provided");
      navigate('/documents');
      return;
    }

    // Log the document ID being viewed
    console.log("Viewing document:", documentId);
    
    // Simulate loading document data - shorter time for Form 47
    const timer = setTimeout(() => {
      setIsLoading(false);
      // For demo purposes, we'll consider Form 47 always available
      if (documentId === "form47") {
        setDocumentNotFound(false);
      }
    }, documentId === "form47" ? 300 : 500);
    
    return () => clearTimeout(timer);
  }, [documentId, navigate]);
  
  const handleBack = () => {
    navigate('/documents');
  };
  
  const handleLoadFailure = () => {
    console.error("Failed to load document");
    setDocumentNotFound(true);
    toast.error("Failed to load document", {
      description: "There was an error loading the document. Please try again."
    });
    // We'll stay on the page to allow retrying
  };
  
  // Special case for Form 47 document - we'll provide a demo version instead
  const isForm47 = documentId === "form47";
  const documentTitle = isForm47 ? "Form 47 - Consumer Proposal" : undefined;
  
  return (
    <MainLayout>
      <div className="mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBack}
          className="flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> 
          Back to Documents
        </Button>
      </div>
      
      <div className="h-[calc(100vh-8rem)]">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : documentNotFound && !isForm47 ? (
          <div className="flex flex-col justify-center items-center h-64 text-center">
            <h3 className="text-xl font-semibold mb-2">Document Not Found</h3>
            <p className="text-muted-foreground mb-4">
              The document you requested could not be found. It may have been deleted or moved.
            </p>
            <Button onClick={handleBack}>Return to Documents</Button>
          </div>
        ) : isForm47 ? (
          <DocumentViewer 
            documentId="form47" 
            documentTitle="Form 47 - Consumer Proposal"
            isForm47={true}
            bypassProcessing={true}
            onLoadFailure={handleLoadFailure}
          />
        ) : (
          <DocumentViewer 
            documentId={documentId} 
            onLoadFailure={handleLoadFailure}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default DocumentViewerPage;
