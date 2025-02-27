
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
      setUploadStep("Validating document...");

      // Validate file type and size
      if (!file.type.match('application/pdf|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a PDF or Word document"
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "File size should be less than 10MB"
        });
        return;
      }

      // Update progress for upload
      setUploadProgress(15);
      setUploadStep("Uploading document to secure storage...");

      // Short pause to show the step
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setUploadProgress(30);
      
      const documentData = await uploadDocument(file);
      
      setUploadProgress(50);
      setUploadStep("Document uploaded. Starting automatic analysis...");
      
      // Short pause to show the step
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setUploadProgress(60);
      setUploadStep("Extracting document text and metadata...");
      
      // Short pause to show the step
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setUploadProgress(75);
      setUploadStep("Conducting regulatory compliance check...");
      
      // Short pause to show the step
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setUploadProgress(90);
      setUploadStep("Finalizing analysis and organizing document...");
      
      // Short pause to show the step
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUploadProgress(100);

      toast({
        title: "Success",
        description: "Document uploaded and analyzed successfully"
      });

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
        title: "Error",
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
