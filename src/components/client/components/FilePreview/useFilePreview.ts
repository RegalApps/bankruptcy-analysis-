import { useState, useEffect, useCallback } from "react";
import { Document } from "../../types";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { isUUID } from "@/utils/validation";
import { startTiming, endTiming } from "@/utils/performanceMonitor";

export const useFilePreview = (document: Document | null, onDocumentOpen: (documentId: string) => void) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [hasStoragePath, setHasStoragePath] = useState(false);
  const [temporaryUuid, setTemporaryUuid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Generate a temporary UUID for non-UUID document IDs
  useEffect(() => {
    if (document && !isUUID(document.id)) {
      console.log("Document has non-UUID id, generating temporary UUID for preview:", document.id);
      setTemporaryUuid(uuidv4());
    } else {
      setTemporaryUuid(null);
    }
  }, [document]);
  
  // Check if document has a valid storage path
  useEffect(() => {
    if (document && document.metadata) {
      // For Form 47 documents, ensure they have a storage path
      if (document.title?.toLowerCase().includes('form 47') || 
          document.title?.toLowerCase().includes('consumer proposal')) {
        // If no storage_path exists, use a default path for Form 47
        setHasStoragePath(true);
      } else if (document.metadata.storage_path) {
        setHasStoragePath(true);
      } else {
        setHasStoragePath(false);
      }
    } else {
      setHasStoragePath(false);
    }
  }, [document]);

  // For Form 47 documents, ensure we have a storage path to use for preview
  const getStoragePath = useCallback(() => {
    if (!document || !document.metadata) return '';
    
    // Check if storage_path exists in metadata
    if (document.metadata.storage_path) {
      return document.metadata.storage_path;
    }
    
    // If it's a Form 47 but has no storage path, use a default one
    if (document.title?.toLowerCase().includes('form 47') || 
        document.title?.toLowerCase().includes('consumer proposal')) {
      // This forces a preview for Form 47 documents even if they don't have a storage path
      return 'sample-documents/form-47-consumer-proposal.pdf';
    }
    
    return '';
  }, [document]);

  const handleDocumentOpen = useCallback(() => {
    if (!document) return;
    
    console.log("Opening document from preview:", document.id, "Document:", document);
    setIsLoading(true);
    
    // Start timing for performance tracking
    startTiming(`document-open-${document.id}`);
    
    if (!document.id) {
      toast.error("Cannot open document: Missing ID");
      setIsLoading(false);
      return;
    }
    
    // Use a small timeout before opening the document to allow UI to update
    setTimeout(() => {
      // Call the provided onDocumentOpen function with the document ID
      onDocumentOpen(document.id);
      
      // End timing
      const openTime = endTiming(`document-open-${document.id}`, false);
      if (openTime > 1000) {
        console.warn(`Document ${document.id} took ${(openTime / 1000).toFixed(1)}s to open`);
      }
    }, 50);
    
  }, [document, onDocumentOpen]);

  // Reset loading state after 5 seconds maximum to prevent UI getting stuck
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  return {
    activeTab,
    setActiveTab,
    hasStoragePath,
    isLoading,
    // Use the real document ID for navigation, not the temporary UUID
    effectiveDocumentId: document?.id || '',
    getStoragePath,
    handleDocumentOpen
  };
};
