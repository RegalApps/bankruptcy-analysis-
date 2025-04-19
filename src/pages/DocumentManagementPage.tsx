
import { useDocuments } from "@/components/DocumentList/hooks/useDocuments";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { DocumentList } from "@/components/documents/DocumentList";
import { TestForm31Upload } from "@/components/documents/TestForm31Upload";
import { cleanupExistingForm31 } from "@/utils/documents/formCleanup";
import logger from "@/utils/logger";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { RobustFileUploader } from "@/components/documents/RobustFileUploader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadProgressTracker } from "@/components/documents/UploadProgressTracker";
import { ensureStorageBuckets } from "@/utils/storage/bucketManager";

export const DocumentManagementPage = () => {
  const { documents, isLoading, refetch } = useDocuments();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Initialize storage on component mount
  useEffect(() => {
    const initializeStorage = async () => {
      try {
        setIsInitializing(true);
        const success = await ensureStorageBuckets();
        
        if (!success) {
          setUploadErrorMessage("Failed to initialize storage system. Please check the diagnostics page for more information.");
        }
      } catch (error) {
        logger.error("Storage initialization failed:", error);
        setUploadErrorMessage("Failed to set up document storage. Please try again later.");
      } finally {
        setIsInitializing(false);
      }
    };
    
    initializeStorage();
  }, [toast]);

  // Auto-refresh document list periodically
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [refetch]);

  const handleDocumentDoubleClick = (documentId: string) => {
    navigate('/', { state: { selectedDocument: documentId } });
  };

  const handleUploadComplete = (documentId: string) => {
    logger.info(`Document uploaded with ID: ${documentId}`);
    refetch();
    
    // Navigate to the document view after a short delay
    setTimeout(() => {
      navigate('/', { state: { selectedDocument: documentId } });
    }, 1500);
  };

  const handleUploadError = (error: Error) => {
    logger.error('Upload error:', error);
    setUploadErrorMessage(error.message);
    toast({
      variant: "destructive",
      title: "Upload Failed",
      description: error.message || "An error occurred during upload"
    });
  };
  
  // Add cleanup handler
  const handleCleanupForm31 = async () => {
    try {
      const success = await cleanupExistingForm31();
      if (success) {
        // Refresh document list after cleanup
        refetch();
      }
    } catch (error) {
      logger.error('Error cleaning up Form 31 documents:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove Form 31 documents"
      });
    }
  };

  return (
    <div className="h-full py-6">
      <div className="container max-w-6xl mx-auto space-y-8">
        <div className="flex justify-end">
          <Button 
            variant="destructive" 
            onClick={handleCleanupForm31} 
            size="sm"
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Remove All Form 31 Documents
          </Button>
        </div>

        {/* Add TestForm31Upload component for testing */}
        <TestForm31Upload />
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Upload Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center">
              {isInitializing ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mb-2"></div>
                  <p>Initializing document storage...</p>
                </div>
              ) : (
                <RobustFileUploader
                  onUploadComplete={handleUploadComplete}
                  onError={handleUploadError}
                  buttonText="Click to Upload Document"
                  maxSizeMB={30}
                />
              )}
              <p className="text-sm text-muted-foreground mt-4">
                Upload PDF, Word, Excel or image files (max 30MB)
              </p>
              
              {uploadErrorMessage && (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive text-destructive rounded-md text-sm">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
                    <div>
                      <p className="font-semibold">Upload Error:</p>
                      <p>{uploadErrorMessage}</p>
                      <div className="mt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate('/upload-diagnostics')}
                        >
                          Run Upload Diagnostics
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <section>
          <h2 className="text-lg font-semibold mb-4">Recently Uploaded</h2>
          <ScrollArea className="h-[calc(100vh-24rem)] rounded-lg border">
            <div className="p-4">
              <DocumentList 
                documents={documents}
                isLoading={isLoading}
                onDocumentDoubleClick={handleDocumentDoubleClick}
              />
            </div>
          </ScrollArea>
        </section>
      </div>
      
      {/* Add progress tracker */}
      <UploadProgressTracker />
    </div>
  );
};

export default DocumentManagementPage;
