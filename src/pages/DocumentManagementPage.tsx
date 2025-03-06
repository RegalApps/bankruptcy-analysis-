
import { useDocuments } from "@/components/DocumentList/hooks/useDocuments";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { uploadDocument } from "@/utils/documentOperations";
import { UploadArea } from "@/components/documents/UploadArea";
import { DocumentList } from "@/components/documents/DocumentList";
import logger from "@/utils/logger";
import { ScrollArea } from "@/components/ui/scroll-area";

export const DocumentManagementPage = () => {
  const { documents, isLoading, refetch } = useDocuments();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState("");
  const { toast } = useToast();

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

  const handleFileUpload = async (file: File) => {
    if (isUploading) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadStep("Stage 1: Validating document format and structure...");

      const validTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (!validTypes.includes(file.type) && 
          !file.name.endsWith('.xlsx') && 
          !file.name.endsWith('.xls') &&
          !file.name.endsWith('.pdf') &&
          !file.name.endsWith('.doc') &&
          !file.name.endsWith('.docx')) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a PDF, Word, or Excel document"
        });
        setIsUploading(false);
        return;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "File size should be less than 10MB"
        });
        setIsUploading(false);
        return;
      }

      setUploadProgress(5);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUploadProgress(10);
      setUploadStep("Stage 2: Preparing document for ingestion...");
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setUploadProgress(15);
      setUploadStep("Stage 3: Uploading document to secure storage...");
      
      logger.info(`Starting upload for file: ${file.name}, size: ${file.size} bytes`);
      
      const documentData = await uploadDocument(file);
      logger.info(`Document uploaded with ID: ${documentData?.id}`);
      
      setUploadProgress(25);
      setUploadStep("Stage 4: Document classification & understanding...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const isExcelFile = file.type.includes('excel') || 
                          file.name.endsWith('.xls') || 
                          file.name.endsWith('.xlsx');
                          
      const isForm76 = file.name.toLowerCase().includes('form 76') || 
                       file.name.toLowerCase().includes('f76') || 
                       file.name.toLowerCase().includes('form76');
      
      setUploadProgress(40);
      if (isExcelFile) {
        setUploadStep("Stage 5: Processing financial data from spreadsheet...");
      } else if (isForm76) {
        setUploadStep("Stage 5: Extracting client information from Form 76...");
      } else {
        setUploadStep("Stage 5: Data extraction & content processing...");
      }
      
      await new Promise(resolve => setTimeout(resolve, 2500));
      setUploadProgress(55);
      
      if (isForm76) {
        setUploadStep("Stage 6: Performing risk & compliance assessment...");
      } else if (isExcelFile) {
        setUploadStep("Stage 6: Validating financial data structure...");
      } else {
        setUploadStep("Stage 6: Analyzing document structure and content...");
      }
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      setUploadProgress(70);
      
      setUploadStep("Stage 7: Issue prioritization & task management...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUploadProgress(85);
      
      setUploadStep("Stage 8: Document organization & client management...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUploadProgress(95);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      setUploadStep("Complete: Document processing finalized.");
      setUploadProgress(100);

      toast({
        title: "Success",
        description: isForm76 
          ? "Form 76 uploaded and analyzed successfully. Client details extracted."
          : isExcelFile
            ? "Financial document uploaded and processed successfully"
            : "Document uploaded and processed successfully"
      });

      refetch();
      
      if (documentData && documentData.id) {
        logger.info(`Navigating to document view for ID: ${documentData.id}`);
        setTimeout(() => {
          navigate('/', { state: { selectedDocument: documentData.id } });
        }, 1500);
      }
    } catch (error) {
      logger.error('Error uploading document:', error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload document. Please try again."
      });
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadStep("");
        setUploadProgress(0);
      }, 2000);
    }
  };

  return (
    <div className="h-full py-6">
      <div className="container max-w-6xl mx-auto space-y-8">
        <UploadArea 
          onFileUpload={handleFileUpload}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          uploadStep={uploadStep}
        />

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
    </div>
  );
};

export default DocumentManagementPage;
