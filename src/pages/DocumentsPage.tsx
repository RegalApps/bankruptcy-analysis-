
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
    
    // If double-clicking a file, navigate to the document viewer
    if (type === "file") {
      // We don't navigate here, just select. Double-click in components will handle navigation
    }
  };

  const handleOpenDocument = (documentId: string) => {
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
