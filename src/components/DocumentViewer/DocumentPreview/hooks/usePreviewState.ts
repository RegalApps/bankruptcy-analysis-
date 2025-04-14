
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Risk, DocumentDetails } from "../../types";

interface PreviewState {
  fileExists: boolean;
  fileUrl: string | null;
  isPdfFile: (path: string) => boolean;
  isExcelFile: (path: string) => boolean;
  isDocFile: (path: string) => boolean;
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
  const [isLoading, setIsLoading] = useState(true);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline' | 'unknown'>('unknown');
  const [attemptCount, setAttemptCount] = useState(0);
  const [documentRisks, setDocumentRisks] = useState<Risk[]>([]);
  const [hasCheckedFile, setHasCheckedFile] = useState(false);

  const getFileExtension = (path: string): string => {
    return path.split('.').pop()?.toLowerCase() || '';
  };

  const isPdfFile = useCallback((path: string): boolean => {
    return getFileExtension(path) === 'pdf';
  }, []);

  const isExcelFile = useCallback((path: string): boolean => {
    const ext = getFileExtension(path);
    return ['xlsx', 'xls', 'csv'].includes(ext);
  }, []);

  const isDocFile = useCallback((path: string): boolean => {
    const ext = getFileExtension(path);
    return ['doc', 'docx'].includes(ext);
  }, []);

  const checkFile = useCallback(async () => {
    if (!storagePath && !documentId.includes('form')) {
      setPreviewError("No storage path provided");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setAttemptCount(prev => prev + 1);

    try {
      // For demo documents with special paths, set fileExists and fileUrl directly
      if (storagePath.includes('demo/') || 
          documentId.includes('form47') || 
          documentId.includes('form31')) {
        
        let demoPath = storagePath;
        if (storagePath === "" && documentId.includes('form47')) {
          demoPath = "demo/form47-consumer-proposal.pdf";
        } else if (storagePath === "" && documentId.includes('form31')) {
          demoPath = "demo/greentech-form31-proof-of-claim.pdf";
        }
        
        console.log("Using demo document path:", demoPath);
        
        // For demo files, we'll still try to get a signed URL, but if it fails we'll use a mock URL
        try {
          const { data, error } = await supabase.storage
            .from('documents')
            .createSignedUrl(demoPath, 3600);
            
          if (data && data.signedUrl) {
            setFileExists(true);
            setFileUrl(data.signedUrl);
          } else {
            // If we can't get a real signed URL, use a mock one for demo purposes
            console.log("Using mock URL for demo document");
            setFileExists(true);
            // Use a public URL for demo files
            setFileUrl(`/documents/sample-form31-greentech.pdf`);
          }
        } catch (err) {
          console.log("Using fallback for demo document");
          setFileExists(true);
          // Use a public URL for demo files
          setFileUrl(`/documents/sample-form31-greentech.pdf`);
        }
        
        setNetworkStatus('online');
        
        if (!bypassAnalysis) {
          await fetchDocumentRisks(documentId);
        }
        
        setIsLoading(false);
        setHasCheckedFile(true);
        return;
      }

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
        setHasCheckedFile(true);
        return;
      }

      if (!data || !data.signedUrl) {
        setFileExists(false);
        setFileUrl(null);
        setPreviewError("File not found or access denied");
        setIsLoading(false);
        setHasCheckedFile(true);
        return;
      }

      setFileExists(true);
      setFileUrl(data.signedUrl);
      setNetworkStatus('online');
      
      if (!bypassAnalysis) {
        await fetchDocumentRisks(documentId);
      }
      
      setIsLoading(false);
      setHasCheckedFile(true);
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
      setHasCheckedFile(true);
    }
  }, [storagePath, documentId, bypassAnalysis]);

  const isDocumentForm47 = (docTitle: string, docType: string): boolean => {
    if (!docTitle && !docType) return false;
    
    const isForm47InTitle = docTitle?.toLowerCase().includes('form 47') || 
                           docTitle?.toLowerCase().includes('f47');
    const isForm47InType = docType?.toLowerCase().includes('form-47') || 
                          docType?.toLowerCase().includes('form 47');
    
    return isForm47InTitle || isForm47InType;
  };

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
                isDocumentForm47(title, 'form-47')) {
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

  // Only run checkFile once on mount, not on every render
  useEffect(() => {
    if (!hasCheckedFile) {
      checkFile();
    }
  }, [checkFile, hasCheckedFile]);

  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatus('online');
      if (previewError && previewError.includes("network") && !hasCheckedFile) {
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
  }, [checkFile, previewError, hasCheckedFile]);

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
