
import React from "react";
import { ClientTemplate } from "@/components/client/components/ClientTemplate";
import { NoClientSelected } from "@/components/activity/components/NoClientSelected";

interface ClientTabContentProps {
  clientId: string;
  onBack: () => void;
  onDocumentOpen: (documentId: string) => void;
}

export const ClientTabContent: React.FC<ClientTabContentProps> = ({
  clientId,
  onBack,
  onDocumentOpen
}) => {
  if (!clientId) {
    console.log("ClientTabContent: No client ID provided");
    return <NoClientSelected />;
  }

  console.log("ClientTabContent: Rendering ClientTemplate with ID:", clientId);
  
  return (
    <ClientTemplate 
      clientId={clientId}
      onBack={onBack}
      onDocumentOpen={onDocumentOpen}
    />
  );
};
