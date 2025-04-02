
import { useCallback } from "react";
import { ClientTabLoading } from "./ClientTabLoading";
import { ClientTabContent } from "./ClientTabContent";
import { useClientTab } from "../hooks/useClientTab";

interface ClientTabProps {
  clientId: string;
  onBack: () => void;
  onDocumentOpen?: (documentId: string) => void;
}

export const ClientTab = ({ clientId, onBack, onDocumentOpen }: ClientTabProps) => {
  console.log("Rendering ClientTab for client:", clientId);
  
  const {
    isTransitioning,
    effectiveClientId,
    handleDocumentOpen
  } = useClientTab({ clientId, onBack });
  
  const documentOpenHandler = useCallback((documentId: string) => {
    if (onDocumentOpen) {
      onDocumentOpen(documentId);
    } else {
      handleDocumentOpen(documentId);
    }
  }, [onDocumentOpen, handleDocumentOpen]);
  
  if (isTransitioning) {
    console.log("ClientTab: Showing transition loading state");
    return <ClientTabLoading clientId={clientId} />;
  }
  
  return (
    <ClientTabContent 
      clientId={effectiveClientId}
      onBack={onBack}
      onDocumentOpen={documentOpenHandler}
    />
  );
};
