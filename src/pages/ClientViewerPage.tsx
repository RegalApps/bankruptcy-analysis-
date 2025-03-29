
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { useFolderNavigation } from "@/components/folders/enhanced/hooks/useFolderNavigation";
import { useCreateFolderStructure } from "@/components/folders/enhanced/hooks/useCreateFolderStructure";
import { DocumentTree } from "@/components/folders/enhanced/components/DocumentTree";
import { useDocuments } from "@/components/DocumentList/hooks/useDocuments";
import { extractClientsFromDocuments } from "@/components/folders/enhanced/hooks/utils/clientExtractionUtils";

const ClientViewerPage = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { documents, refetch } = useDocuments();
  const { folders } = useCreateFolderStructure(documents || []);
  const { selectedItemId, selectedItemType, handleItemSelect, handleOpenDocument } = useFolderNavigation(documents || []);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  
  // Use client extraction utilities
  const clients = extractClientsFromDocuments(documents || []);
  const selectedClient = clients.find(c => c.id === clientId);
  
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
  
  const toggleFolder = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };
  
  // Handlers for drag and drop
  const handleDragStart = () => {};
  const handleDragOver = () => {};
  const handleDragLeave = () => {};
  const handleDrop = () => {};
  
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
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">
              {selectedClient?.name || clientId}
            </h2>
            
            <DocumentTree
              filteredFolders={folders}
              filteredDocuments={documents || []}
              form47Documents={[]} // Empty array to remove the Consumer Proposal warning
              selectedFolderId={selectedItemId && selectedItemType === "folder" ? selectedItemId : undefined}
              selectedClientId={clientId}
              expandedFolders={expandedFolders}
              dragOverFolder={null}
              onFolderSelect={(id) => handleItemSelect(id, "folder")}
              onDocumentSelect={(id) => handleItemSelect(id, "file")}
              onDocumentOpen={handleOpenDocument}
              toggleFolder={toggleFolder}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ClientViewerPage;
