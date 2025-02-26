
import { FolderManagement } from "@/components/folders/FolderManagement";
import { useDocuments } from "@/components/DocumentList/hooks/useDocuments";
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { useState } from "react";

export const FoldersPage = () => {
  const { documents, refetch } = useDocuments();
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>();
  const [selectedItemType, setSelectedItemType] = useState<"folder" | "file" | undefined>();

  const handleItemSelect = (id: string, type: "folder" | "file") => {
    setSelectedItemId(id);
    setSelectedItemType(type);
  };

  return (
    <div className="min-h-screen bg-background">
      <MainSidebar />
      <div className="pl-64">
        <MainHeader />
        <div className="p-6">
          <FolderManagement 
            documents={documents ?? []}
            selectedItemId={selectedItemId}
            selectedItemType={selectedItemType}
            onItemSelect={handleItemSelect}
            onRefresh={refetch}
          />
        </div>
      </div>
    </div>
  );
};
