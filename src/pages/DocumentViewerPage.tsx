
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileBarChart } from "lucide-react";
import { DocumentViewer } from "@/components/DocumentViewer";
import { MetadataTag } from "@/components/DocumentViewer/MetadataTag";

const DocumentViewerPage = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading document data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [documentId]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleLoadFailure = () => {
    console.error("Failed to load document");
    // Could navigate back or show an error state
  };
  
  return (
    <MainLayout>
      <div className="flex flex-col items-center mb-4">
        <div className="w-full text-center mb-2">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-xl font-semibold">Form 47 Consumer Proposal Form.pdf</h1>
            <MetadataTag 
              label="Division II Proposal" 
              variant="secondary"
              icon={<FileBarChart className="h-3 w-3 mr-1 text-blue-500" />}
            />
          </div>
        </div>
        
        <div className="w-full border-b mb-2"></div>
        
        <div className="w-full">
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
      </div>
      
      <div className="h-[calc(100vh-10rem)]">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          documentId === "form47" ? (
            <DocumentViewer 
              documentId="form47" 
              documentTitle="Form 47 - Consumer Proposal"
              isForm47={true}
              onLoadFailure={handleLoadFailure}
            />
          ) : (
            <div className="border rounded-lg bg-card p-4 text-center">
              <h2 className="text-lg font-semibold mb-2">Document Not Found</h2>
              <p className="text-muted-foreground mb-4">The document you're looking for doesn't exist or you don't have access.</p>
              <Button onClick={handleBack}>Go Back</Button>
            </div>
          )
        )}
      </div>
    </MainLayout>
  );
};

export default DocumentViewerPage;
