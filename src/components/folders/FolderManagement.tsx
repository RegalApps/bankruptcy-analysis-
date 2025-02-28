
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tag, Tags } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Document } from "@/components/DocumentList/types";
import { FolderDialog } from "./components/FolderDialog";
import { ViewOptionsDropdown } from "./components/ViewOptionsDropdown";
import { FolderGrid } from "./components/FolderGrid";
import { UncategorizedGrid } from "./components/UncategorizedGrid";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface FolderManagementProps {
  documents: Document[];
  selectedItemId?: string;
  selectedItemType?: "folder" | "file";
  onItemSelect: (id: string, type: "folder" | "file") => void;
  onRefresh?: () => void;
  onOpenDocument?: (documentId: string) => void;
}

export const FolderManagement = ({ 
  documents,
  selectedItemId,
  selectedItemType,
  onItemSelect,
  onRefresh,
  onOpenDocument 
}: FolderManagementProps) => {
  const [showFolderDialog, setShowFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [activeView, setActiveView] = useState<"all" | "uncategorized" | "folders">("all");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  // Filter documents based on active view
  const getFilteredDocuments = () => {
    switch (activeView) {
      case "folders":
        return documents.filter(doc => doc.is_folder);
      case "uncategorized":
        return documents.filter(doc => !doc.is_folder && !doc.parent_folder_id);
      case "all":
      default:
        return documents;
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert([
          {
            title: newFolderName,
            is_folder: true,
            folder_type: 'client',
          }
        ]);

      if (error) throw error;
      
      setShowFolderDialog(false);
      setNewFolderName("");
      toast.success("Folder created successfully");
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error("Failed to create folder");
    }
  };

  const handleDocumentDrop = async (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    const documentId = e.dataTransfer.getData('documentId');
    if (!documentId) return;

    try {
      const { error } = await supabase
        .from('documents')
        .update({ parent_folder_id: folderId })
        .eq('id', documentId);

      if (error) throw error;
      toast.success("Document moved successfully");
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error moving document:', error);
      toast.error("Failed to move document");
    }
    setIsDragging(false);
  };

  const handleFolderSelect = (folderId: string) => {
    setSelectedFolder(folderId);
    onItemSelect(folderId, "folder");
  };

  // Organize documents into proper structure
  const folders = documents.filter(doc => doc.is_folder);
  const uncategorizedDocuments = documents.filter(doc => !doc.is_folder && !doc.parent_folder_id);
  const filteredDocuments = getFilteredDocuments();
  
  // Log to help debug the folder structure
  console.log('All documents:', documents);
  console.log('Folders:', folders);
  console.log('Folder structure:', folders.map(f => ({
    id: f.id,
    title: f.title,
    type: f.folder_type,
    parent_id: f.parent_folder_id
  })));

  // Handler for opening a document - uses the onOpenDocument prop if provided
  const handleOpenDocument = (documentId: string) => {
    if (onOpenDocument) {
      onOpenDocument(documentId);
    }
  };

  // Handler for document selection
  const handleDocumentSelect = (documentId: string) => {
    onItemSelect(documentId, "file");
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-xl">Document Management</h3>
            <ViewOptionsDropdown 
              onViewChange={setActiveView}
              selectedItemId={selectedItemId}
              selectedItemType={selectedItemType}
              onRefresh={onRefresh}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant="default" 
              size="sm"
              onClick={() => setShowFolderDialog(true)}
            >
              + New Folder
            </Button>
            <FolderDialog
              showDialog={showFolderDialog}
              setShowDialog={setShowFolderDialog}
              folderName={newFolderName}
              setFolderName={setNewFolderName}
              onCreateFolder={handleCreateFolder}
            />
            <Button variant="outline" size="sm">
              <Tag className="h-4 w-4 mr-2" />
              Add Meta Tags
            </Button>
            <Button variant="outline" size="sm">
              <Tags className="h-4 w-4 mr-2" />
              Manage Tags
            </Button>
          </div>
        </div>

        <Tabs defaultValue="folders" className="mt-6">
          <TabsList className="mb-4">
            <TabsTrigger value="folders">Folders</TabsTrigger>
            <TabsTrigger value="uncategorized">Uncategorized</TabsTrigger>
          </TabsList>

          <TabsContent value="folders">
            <FolderGrid
              folders={folders}
              documents={documents}
              isDragging={isDragging}
              selectedFolder={selectedFolder}
              onFolderSelect={handleFolderSelect}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDocumentDrop}
            />
          </TabsContent>

          <TabsContent value="uncategorized">
            <UncategorizedGrid 
              documents={uncategorizedDocuments}
              onDocumentSelect={handleDocumentSelect}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
