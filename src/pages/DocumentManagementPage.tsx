
import { useDocuments } from "@/components/DocumentList/hooks/useDocuments";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { uploadDocument } from "@/utils/documentOperations";
import { UploadArea } from "@/components/documents/UploadArea";
import { DocumentList } from "@/components/documents/DocumentList";

export const DocumentManagementPage = () => {
  const { documents, isLoading, refetch } = useDocuments();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState("");
  const { toast } = useToast();

  const handleDocumentDoubleClick = (documentId: string) => {
    navigate('/', { state: { selectedDocument: documentId } });
  };

  const handleFileUpload = async (file: File) => {
    if (isUploading) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadStep("Validating document format and size...");

      // Validate file type and size
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

      // Update progress for upload
      setUploadProgress(15);
      setUploadStep("Uploading document to secure storage...");
      
      // Actual upload process starts
      setUploadProgress(25);
      
      // Upload document data
      const documentData = await uploadDocument(file);
      
      setUploadProgress(50);

      // Different message based on file type      
      const isExcelFile = file.type.includes('excel') || 
                          file.name.endsWith('.xls') || 
                          file.name.endsWith('.xlsx');
                          
      const isForm76 = file.name.toLowerCase().includes('form 76') || 
                       file.name.toLowerCase().includes('f76') || 
                       file.name.toLowerCase().includes('form76');
      
      if (isExcelFile) {
        setUploadStep("Processing financial data from spreadsheet...");
      } else if (isForm76) {
        setUploadStep("Analyzing Form 76 monthly income statement...");
      } else {
        setUploadStep("Analyzing document contents...");
      }
      
      setUploadProgress(65);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (isForm76) {
        setUploadStep("Extracting client information from Form 76...");
      } else if (isExcelFile) {
        setUploadStep("Extracting financial records from spreadsheet...");
      } else {
        setUploadStep("Organizing document in folder structure...");
      }
      
      setUploadProgress(80);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (isForm76) {
        setUploadStep("Performing regulatory compliance checks...");
      } else if (isExcelFile) {
        setUploadStep("Finalizing financial data processing...");
      } else {
        setUploadStep("Finalizing document processing...");
      }
      
      setUploadProgress(95);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setUploadProgress(100);
      setUploadStep("Upload complete!");

      toast({
        title: "Success",
        description: isForm76 
          ? "Form 76 uploaded and analyzed successfully"
          : isExcelFile
            ? "Financial document uploaded and processed successfully"
            : "Document uploaded and processed successfully"
      });

      // Refresh document list
      refetch();
      
      // If a document was uploaded successfully, navigate to view it
      if (documentData && documentData.id) {
        setTimeout(() => {
          navigate('/', { state: { selectedDocument: documentData.id } });
        }, 1000);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload document. Please try again."
      });
    } finally {
      setIsUploading(false);
      setUploadStep("");
      setUploadProgress(0);
    }
  };

  return (
    <div className="flex-1 p-6 space-y-8">
      <UploadArea 
        onFileUpload={handleFileUpload}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        uploadStep={uploadStep}
      />

      <section>
        <h2 className="text-lg font-semibold mb-4">Recently Uploaded</h2>
        <DocumentList 
          documents={documents}
          isLoading={isLoading}
          onDocumentDoubleClick={handleDocumentDoubleClick}
        />
      </section>
    </div>
  );
};

export default DocumentManagementPage;
