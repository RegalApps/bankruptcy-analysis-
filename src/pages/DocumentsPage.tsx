
import { useDocuments } from "@/components/DocumentList/hooks/useDocuments";
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { FolderManagement } from "@/components/folders/FolderManagement";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const DocumentsPage = () => {
  const { documents, refetch } = useDocuments();
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>();
  const [selectedItemType, setSelectedItemType] = useState<"folder" | "file" | undefined>();
  const navigate = useNavigate();

  const handleItemSelect = (id: string, type: "folder" | "file") => {
    setSelectedItemId(id);
    setSelectedItemType(type);
  };

  const handleOpenDocument = (documentId: string) => {
    // Navigate to the home page with the selected document ID in the state
    navigate('/', { state: { selectedDocument: documentId } });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <MainSidebar />
      <div className="flex-1 flex flex-col pl-64">
        <MainHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <FolderManagement 
            documents={documents ?? []} 
            selectedItemId={selectedItemId}
            selectedItemType={selectedItemType}
            onItemSelect={handleItemSelect}
            onRefresh={refetch}
            onOpenDocument={handleOpenDocument}
          />
        </main>
      </div>
    </div>
  );
};
