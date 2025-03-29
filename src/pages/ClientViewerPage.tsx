
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { ClientViewer } from "@/components/client/ClientViewer";
import { toast } from "sonner";

const ClientViewerPage = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (clientId) {
      setIsLoading(false);
    } else {
      toast.error("No client specified");
      navigate("/documents");
    }
  }, [clientId, navigate]);
  
  const handleBack = () => {
    navigate("/documents");
  };
  
  const handleDocumentOpen = (documentId: string) => {
    navigate("/", { state: { selectedDocument: documentId } });
  };
  
  return (
    <MainLayout>
      <div className="mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBack}
          className="flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> 
          Back to Documents
        </Button>
      </div>
      
      <div className="border rounded-lg bg-card overflow-hidden">
        {!isLoading && clientId && (
          <ClientViewer 
            clientId={clientId}
            onBack={handleBack}
            onDocumentOpen={handleDocumentOpen}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default ClientViewerPage;
