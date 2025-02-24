
import { FolderManagement } from "@/components/folders/FolderManagement";
import { useDocuments } from "@/components/DocumentList/hooks/useDocuments";
import { MainHeader } from "@/components/header/MainHeader";

export const FoldersPage = () => {
  const { documents } = useDocuments();

  return (
    <div className="pl-16">
      <MainHeader />
      <div className="p-6">
        <FolderManagement documents={documents} />
      </div>
    </div>
  );
};
