
import { DocumentManagement } from "@/components/DocumentList/DocumentManagement";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const DocumentManagementPage = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Document Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <FileUpload />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <DocumentManagement />
    </div>
  );
};

export default DocumentManagementPage;
