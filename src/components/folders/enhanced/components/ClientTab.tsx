
import { ClientViewer } from "@/components/client/ClientViewer";
import { Document } from "@/components/DocumentList/types";

interface ClientTabProps {
  clientId: string;
  onBack: () => void;
  onDocumentOpen: (documentId: string) => void;
}

export const ClientTab = ({ clientId, onBack, onDocumentOpen }: ClientTabProps) => {
  return (
    <ClientViewer 
      clientId={clientId} 
      onBack={onBack}
      onDocumentOpen={onDocumentOpen}
    />
  );
};
