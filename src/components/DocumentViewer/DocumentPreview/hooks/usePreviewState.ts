
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Risk } from "../../types";
import { isDocumentForm47 } from "../../utils/documentTypeUtils";

interface PreviewState {
  fileExists: boolean;
  fileUrl: string | null;
  isPdfFile: boolean;
  isExcelFile: boolean;
  isDocFile: boolean;
  isLoading: boolean;
  previewError: string | null;
  setPreviewError: (error: string | null) => void;
  checkFile: () => Promise<void>;
  networkStatus: 'online' | 'offline' | 'unknown';
  attemptCount: number;
  documentRisks: Risk[];
}

const usePreviewState = (
  storagePath: string, 
  documentId: string, 
  title: string,
  onAnalysisComplete?: () => void,
  bypassAnalysis: boolean = false
): PreviewState => {
  const [fileExists, setFileExists] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isPdfFile, setIsPdfFile] = useState(false);
  const [isExcelFile, setIsExcelFile] = useState(false);
  const [isDocFile, setIsDocFile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline' | 'unknown'>('unknown');
  const [attemptCount, setAttemptCount] = useState(0);
  const [documentRisks, setDocumentRisks] = useState<Risk[]>([]);

  const getFileExtension = (path: string): string => {
    return path.split('.').pop()?.toLowerCase() || '';
  };

  const checkFile = useCallback(async () => {
    if (!storagePath) {
      setPreviewError("No storage path provided");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setAttemptCount(prev => prev + 1);

    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(storagePath, 3600);

      if (error) {
        console.error("Error getting file URL:", error);
        setFileExists(false);
        setFileUrl(null);
        setPreviewError(`Error loading document: ${error.message}`);
        setNetworkStatus(error.message.includes("network") ? 'offline' : 'online');
        setIsLoading(false);
        return;
      }

      if (!data || !data.signedUrl) {
        setFileExists(false);
        setFileUrl(null);
        setPreviewError("File not found or access denied");
        setIsLoading(false);
        return;
      }

      setFileExists(true);
      setFileUrl(data.signedUrl);
      setNetworkStatus('online');
      
      const extension = getFileExtension(storagePath);
      setIsPdfFile(extension === 'pdf');
      setIsExcelFile(['xlsx', 'xls', 'csv'].includes(extension));
      setIsDocFile(['doc', 'docx'].includes(extension));
      
      if (!bypassAnalysis) {
        await fetchDocumentRisks(documentId);
      }
      
      setIsLoading(false);
    } catch (error: any) {
      console.error("Exception checking file:", error);
      setFileExists(false);
      setFileUrl(null);
      setPreviewError(`Error: ${error.message || "Unknown error occurred"}`);
      setNetworkStatus(
        error.message?.includes("network") || 
        error.message?.includes("fetch") || 
        error.message?.includes("connection")
          ? 'offline' 
          : 'online'
      );
      setIsLoading(false);
    }
  }, [storagePath, documentId, bypassAnalysis]);

  const fetchDocumentRisks = async (docId: string) => {
    try {
      const { data, error } = await supabase
        .from('document_analysis')
        .select('content')
        .eq('document_id', docId)
        .single();

      if (error) {
        console.log("No analysis found for document");
        return;
      }

      if (data?.content?.risks) {
        setDocumentRisks(data.content.risks);
      } else if (data?.content?.extracted_info?.formType === 'form-47' || 
                isDocumentForm47({ 
                  id: documentId, 
                  title, 
                  type: 'form-47',
                  storage_path: storagePath 
                })) {
        const defaultForm47Risks: Risk[] = [
          {
            type: "Missing Creditor Information",
            description: "The proposal must include complete details of all creditors.",
            severity: "high",
            regulation: "BIA Section 66.13",
            impact: "Proposal may be rejected by the Official Receiver",
            requiredAction: "Add missing creditor information",
            solution: "Complete the creditor section with names, addresses, and amounts owed"
          },
          {
            type: "Payment Schedule Incomplete",
            description: "The payment schedule lacks specific repayment terms",
            severity: "medium",
            regulation: "BIA Section 66.14",
            impact: "May lead to implementation issues during proposal execution",
            requiredAction: "Complete payment schedule details",
            solution: "Specify payment amounts, frequency, and start/end dates"
          },
          {
            type: "Missing Administrator Certificate",
            description: "The proposal requires a signed certificate from the administrator",
            severity: "high",
            regulation: "BIA Rules 66(2)",
            impact: "Proposal cannot be filed without this certificate",
            requiredAction: "Obtain administrator certificate",
            solution: "Have the Licensed Insolvency Trustee complete and sign the certificate section"
          }
        ];
        setDocumentRisks(defaultForm47Risks);
      }
    } catch (err) {
      console.error("Error fetching document risks:", err);
    }
  };

  useEffect(() => {
    checkFile();
  }, [checkFile]);

  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatus('online');
      if (previewError && previewError.includes("network")) {
        checkFile();
      }
    };

    const handleOffline = () => {
      setNetworkStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkFile, previewError]);

  return {
    fileExists,
    fileUrl,
    isPdfFile,
    isExcelFile,
    isDocFile,
    isLoading,
    previewError,
    setPreviewError,
    checkFile,
    networkStatus,
    attemptCount,
    documentRisks
  };
};

export default usePreviewState;
