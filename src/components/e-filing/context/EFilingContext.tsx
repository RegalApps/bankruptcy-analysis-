
import React, { createContext, useContext, useState } from 'react';
import { toast } from "sonner";

interface EFilingContextType {
  documents: EFilingDocument[];
  selectedDocument: EFilingDocument | null;
  isProcessing: boolean;
  selectDocument: (doc: EFilingDocument | null) => void;
  initiateEFiling: (documentId: string) => Promise<void>;
}

interface EFilingDocument {
  id: string;
  title: string;
  status: 'pending' | 'validating' | 'ready' | 'error';
  validationErrors?: string[];
  lastUpdated: Date;
  metadata: Record<string, any>;
}

const EFilingContext = createContext<EFilingContextType | undefined>(undefined);

export const EFilingProvider = ({ children }: { children: React.ReactNode }) => {
  const [documents, setDocuments] = useState<EFilingDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<EFilingDocument | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectDocument = (doc: EFilingDocument | null) => {
    setSelectedDocument(doc);
  };

  const initiateEFiling = async (documentId: string) => {
    setIsProcessing(true);
    try {
      // Redirect to the SSO login page
      window.location.href = "https://sso.ised-isde.canada.ca/auth/realms/individual/protocol/openid-connect/auth?response_type=code&client_id=osb-ef&redirect_uri=https%3A%2F%2Fwww.ic.gc.ca%2Fapp%2Fscr%2Fosbeftr%2Fapp%2Fsso%2Flogin&state=b0b0bc06-3b9b-4c67-a26f-b9b4bda7520f&login=true&ui_locales=en&scope=openid";
    } catch (error) {
      console.error('E-Filing error:', error);
      toast.error("Failed to initiate e-filing process");
    } finally {
      setIsProcessing(false);
    }
  };

  const value = {
    documents,
    selectedDocument,
    isProcessing,
    selectDocument,
    initiateEFiling,
  };

  return <EFilingContext.Provider value={value}>{children}</EFilingContext.Provider>;
};

export const useEFiling = () => {
  const context = useContext(EFilingContext);
  if (context === undefined) {
    throw new Error('useEFiling must be used within an EFilingProvider');
  }
  return context;
};
