
import { useState } from "react";
import { ClientViewer } from "@/components/client/ClientViewer";
import { ClientNotFound } from "@/components/client/components/ClientNotFound";

interface ClientTabProps {
  clientId: string;
  onBack: () => void;
  onDocumentOpen: (documentId: string) => void;
}

export const ClientTab = ({ clientId, onBack, onDocumentOpen }: ClientTabProps) => {
  const [loadError, setLoadError] = useState<boolean>(false);
  
  if (loadError) {
    return <ClientNotFound onBack={onBack} />;
  }
  
  return (
    <ClientViewer 
      clientId={clientId} 
      onBack={onBack}
      onDocumentOpen={onDocumentOpen}
      onError={() => setLoadError(true)}
    />
  );
};
