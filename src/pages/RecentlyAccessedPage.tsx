
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { UploadArea } from "@/components/documents/UploadArea";
import { RecentClients } from "@/components/dashboard/RecentClients";
import { RecentDocuments } from "@/components/dashboard/RecentDocuments";
import { uploadDocument } from "@/utils/documentOperations";
import { fixDocumentUpload } from "@/utils/documentUploadFix";
import { detectDocumentType } from "@/components/FileUpload/utils/fileTypeDetector";
import logger from "@/utils/logger";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { trackUpload } from "@/utils/documents/uploadTracker";

export const RecentlyAccessedPage = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const checkStorage = async () => {
      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        const hasDocumentsBucket = buckets?.some(bucket => bucket.name === 'documents');
        
        if (!hasDocumentsBucket) {
          console.warn('Documents bucket is missing - will be created when needed');
        }
      } catch (err) {
        console.error('Error checking storage:', err);
      }
    };
    
    checkStorage();
  }, []);

  const handleDocumentSelect = async (documentId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase
          .from('document_access_history')
          .insert({
            user_id: user.id,
            document_id: documentId,
            accessed_at: new Date().toISOString(),
            access_source: 'homepage',
            session_id: Math.random().toString(36).substring(2, 15) // Simple session ID
          });
      }
    } catch (error) {
      console.error("Error recording document access:", error);
    }
    
    navigate('/', { state: { selectedDocument: documentId } });
  };

  const handleClientSelect = (clientId: string) => {
    navigate(`/documents?clientId=${clientId}`);
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
      
      try {
        const { fixed, message } = await fixDocumentUpload();
        
        if (!fixed) {
          toast({
            variant: "destructive",
            title: "Storage System Error",
            description: message
          });
          throw new Error('Storage system not properly configured');
        }
        
        const { isForm76, isExcel } = detectDocumentType(file);
        
        // Create a upload tracker with file metadata
        const documentId = crypto.randomUUID();
        const uploadTracker = trackUpload(documentId, 15, {
          fileType: file.type || (file.name.split('.').pop() || 'unknown'),
          fileSize: file.size,
          fileName: file.name,
          isForm76,
          isExcel
        });
        
        const documentData = await uploadDocument(
          file,
          (progress, message) => {
            setUploadProgress(Math.min(Math.floor(progress * 0.7) + 15, 85)); // Scale to fit our UI stages
            setUploadStep(message);
            uploadTracker.updateProgress(progress, message);
          }
        );
        
        logger.info(`Document uploaded with ID: ${documentData?.id}`);
        
        setUploadProgress(85);
        setUploadStep("Stage 7: Issue prioritization & task management...");
        uploadTracker.updateProgress(85, "Issue prioritization & task management...");
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setUploadStep("Stage 8: Document organization & client management...");
        uploadTracker.updateProgress(95, "Document organization & client management...");
        await new Promise(resolve => setTimeout(resolve, 2000));
        setUploadProgress(95);
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        setUploadStep("Complete: Document processing finalized.");
        setUploadProgress(100);
        uploadTracker.completeUpload("Document processing finalized.");

        toast({
          title: "Success",
          description: isForm76 
            ? "Form 76 uploaded and analyzed successfully. Client details extracted."
            : isExcel
              ? "Financial document uploaded and processed successfully"
              : "Document uploaded and processed successfully"
        });
      
        if (documentData && documentData.id) {
          logger.info(`Navigating to document view for ID: ${documentData.id}`);
          
          try {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user) {
              await supabase
                .from('document_access_history')
                .insert({
                  user_id: user.id,
                  document_id: documentData.id,
                  accessed_at: new Date().toISOString(),
                  access_source: 'upload',
                  session_id: Math.random().toString(36).substring(2, 15) // Simple session ID
                });
            }
          } catch (error) {
            console.error("Error recording document access:", error);
          }
          
          setTimeout(() => {
            navigate('/', { state: { selectedDocument: documentData.id } });
          }, 1500);
        }
      } catch (error: any) {
        if (error.message.includes('Storage system not properly configured')) {
          console.log("Storage system error detected, showing detailed error");
          toast({
            variant: "destructive",
            title: "Storage System Unavailable",
            description: "The document storage system is not properly configured. This might require administrator assistance."
          });
        } else {
          throw error;
        }
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

        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
            <TabsTrigger value="clients">Recent Clients</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent" className="space-y-4">
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Recently Accessed Documents</h2>
              <RecentDocuments onDocumentSelect={handleDocumentSelect} />
            </Card>
          </TabsContent>
          
          <TabsContent value="clients" className="space-y-4">
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Recently Accessed Clients</h2>
              <RecentClients onClientSelect={handleClientSelect} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RecentlyAccessedPage;
