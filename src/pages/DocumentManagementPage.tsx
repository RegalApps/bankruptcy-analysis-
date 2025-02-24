
import { DocumentManagement } from "@/components/DocumentList/DocumentManagement";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Bell,
  FileText,
  FolderPlus,
  Home,
  PieChart,
  Plus,
  Settings,
  Upload,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

const navigation = [
  { name: 'Home', icon: Home },
  { name: 'Document Folders', icon: FileText },
  { name: 'Upload', icon: Upload },
  { name: 'Reports', icon: PieChart },
  { name: 'Settings', icon: Settings },
];

export const DocumentManagementPage = () => {
  const { toast } = useToast();

  const handleUploadComplete = useCallback(async (documentId: string) => {
    toast({
      title: "Success",
      description: "Document uploaded successfully",
    });
  }, [toast]);

  return (
    <div className="min-h-screen flex">
      {/* Main Navigation Sidebar */}
      <aside className="w-16 bg-background border-r flex flex-col items-center py-4 space-y-4">
        {/* Logo Section */}
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-8">
          <FileText className="w-6 h-6 text-primary" />
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 w-full">
          {navigation.map((item) => (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-full mb-2"
                >
                  <item.icon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>

        {/* User Section */}
        <div className="mt-auto space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Profile</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center px-6 gap-4">
            <h1 className="text-xl font-semibold">Document Management</h1>
            <div className="flex items-center gap-2 ml-auto">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Upload New Document</DialogTitle>
                  </DialogHeader>
                  <div className="p-4">
                    <FileUpload onUploadComplete={handleUploadComplete} />
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline">
                <FolderPlus className="h-4 w-4 mr-2" />
                New Folder
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <DocumentManagement />
        </main>
      </div>
    </div>
  );
};

export default DocumentManagementPage;
