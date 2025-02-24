
import { FolderManagement } from "@/components/folders/FolderManagement";
import { useDocuments } from "@/components/DocumentList/hooks/useDocuments";
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";

export const FoldersPage = () => {
  const { documents } = useDocuments();

  return (
    <div className="min-h-screen bg-background">
      <MainSidebar />
      <div className="pl-64">
        <MainHeader />
        <div className="p-6">
          <FolderManagement documents={documents} />
        </div>
      </div>
    </div>
  );
};
