
import { useDocuments } from "@/components/DocumentList/hooks/useDocuments";
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { FolderManagement } from "@/components/folders/FolderManagement";

export const DocumentsPage = () => {
  const { documents } = useDocuments();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <MainSidebar />
      <div className="flex-1 flex flex-col pl-64">
        <MainHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <FolderManagement documents={documents} />
        </main>
      </div>
    </div>
  );
};
