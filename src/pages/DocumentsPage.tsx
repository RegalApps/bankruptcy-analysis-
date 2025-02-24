
import { useDocuments } from "@/components/DocumentList/hooks/useDocuments";
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { FolderManagement } from "@/components/folders/FolderManagement";

export const DocumentsPage = () => {
  const { documents } = useDocuments();

  return (
    <div className="min-h-screen bg-background">
      <MainSidebar />
      <div className="pl-64">
        <MainHeader />
        <main className="p-6">
          <FolderManagement documents={documents} />
        </main>
      </div>
    </div>
  );
};
