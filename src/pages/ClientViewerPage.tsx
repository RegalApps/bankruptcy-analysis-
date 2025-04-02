
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { toast } from "sonner";
import { useClientData } from "@/hooks/useClientData";
import { ClientViewerHeader } from "@/components/client/components/ClientViewerHeader";
import { ClientViewContent } from "@/components/client/components/ClientViewContent";
import { ClientViewerLoadingState } from "@/components/client/components/ClientViewerLoadingState";
import { ClientViewerNotFound } from "@/components/client/components/ClientViewerNotFound";
import { Client } from "@/components/client/types";

const ClientViewerPage = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  
  const { 
    client, 
    documents, 
    tasks,
    recentActivities,
    isLoading, 
    selectedDocumentId, 
    setSelectedDocumentId,
    setClient
  } = useClientData(clientId);
  
  const handleBack = () => {
    navigate("/documents");
  };
  
  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocumentId(documentId);
  };

  const handleClientUpdate = (updatedClient: Client) => {
    setClient(updatedClient);
    toast.success("Client information updated successfully");
  };
  
  return (
    <MainLayout>
      <ClientViewerHeader 
        isLoading={isLoading} 
        clientName={client?.name} 
        onBack={handleBack} 
      />
      
      {isLoading ? (
        <ClientViewerLoadingState />
      ) : client ? (
        <ClientViewContent 
          client={client}
          documents={documents}
          selectedDocumentId={selectedDocumentId}
          onDocumentSelect={handleDocumentSelect}
          tasks={tasks}
          recentActivities={recentActivities}
          onClientUpdate={handleClientUpdate}
        />
      ) : (
        <ClientViewerNotFound onBack={handleBack} />
      )}
    </MainLayout>
  );
};

export default ClientViewerPage;
