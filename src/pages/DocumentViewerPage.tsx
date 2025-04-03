import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ChevronLeft, AlertCircle, FileText } from "lucide-react";
import { DocumentViewer } from "@/components/DocumentViewer";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";

interface DocumentData {
  id: string;
  title: string;
  storage_path: string;
  type: string;
  metadata?: Record<string, any>;
}

const DocumentViewerPage = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const stateDocumentTitle = location.state?.documentTitle;
  const stateIsForm47 = location.state?.isForm47;
  
  useEffect(() => {
    if (!documentId) {
      setError("No document ID provided");
      setIsLoading(false);
      return;
    }
    
    const fetchDocument = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (stateIsForm47 && documentId === "form47") {
          setDocument({
            id: "form47",
            title: stateDocumentTitle || "Form 47 - Consumer Proposal",
            storage_path: "/documents/form47.pdf",
            type: "Consumer Proposal"
          });
          setIsLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('id', documentId)
          .single();
          
        if (error) {
          console.error("Error fetching document:", error);
          throw new Error(error.message);
        }
        
        if (!data) {
          throw new Error("Document not found");
        }
        
        setDocument(data);
      } catch (err: any) {
        console.error("Failed to load document", err);
        setError(err.message || "Failed to load document");
        toast.error("Could not load document", {
          description: err.message || "The document could not be loaded"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDocument();
  }, [documentId, stateDocumentTitle, stateIsForm47]);
  
  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/documents');
    }
  };
  
  const handleLoadFailure = () => {
    console.error("Failed to load document");
    setError("The document viewer encountered an error");
    toast.error("Document view error", {
      description: "There was a problem displaying this document"
    });
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
          Back
        </Button>
      </div>
      
      <div className="h-[calc(100vh-8rem)]">
        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Skeleton className="h-12 w-12 rounded" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
              <Skeleton className="h-[60vh] w-full" />
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="border-destructive">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h2 className="text-xl font-semibold mb-2">Document Error</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={handleBack}>Return to Documents</Button>
            </CardContent>
          </Card>
        ) : document ? (
          <DocumentViewer 
            documentId={document.id} 
            documentTitle={document.title}
            isForm47={stateIsForm47 || document.type === "Consumer Proposal"}
            onLoadFailure={handleLoadFailure}
          />
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Document Not Found</h2>
              <p className="text-muted-foreground mb-4">The document you're looking for doesn't exist or you don't have access.</p>
              <Button onClick={handleBack}>Go Back</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default DocumentViewerPage;
