import { useEffect } from "react";

/**
 * A stub for real-time updates in local-only mode
 * In a local-only implementation, there's no real-time subscription needed
 * This is kept as a placeholder to maintain the same API
 */
export const useDocumentRealtime = (
  documentId: string | null,
  onUpdate: (() => void) | null
) => {
  useEffect(() => {
    if (!documentId || !onUpdate) return;
    
    // Log that we're in local-only mode
    console.log(`Local-only mode: No real-time updates for document ${documentId}`);
    
    // In local-only mode, we don't need to set up any subscriptions
    // This is just a placeholder to maintain the same API
    
    return () => {
      // No cleanup needed in local-only mode
    };
  }, [documentId, onUpdate]);
};
