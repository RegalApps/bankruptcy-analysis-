
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
  
  useEffect(() => {
    if (!documentId) {
      toast.error("No document ID provided");
      navigate('/documents');
      return;
    }

    // Log the document ID being viewed
    console.log("Viewing document:", documentId);
    
    // Simulate loading document data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [documentId, navigate]);
  
  const handleBack = () => {
    navigate('/documents');
  };
  
  const handleLoadFailure = () => {
    console.error("Failed to load document");
    toast.error("Failed to load document", {
      description: "There was an error loading the document. Please try again."
    });
    // Stay on the page to allow retrying
  };
  
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
        ) : documentId === "form47" ? (
          <DocumentViewer 
            documentId="form47" 
            documentTitle="Form 47 - Consumer Proposal"
            isForm47={true}
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
