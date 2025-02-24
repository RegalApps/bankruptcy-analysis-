
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FolderIcon } from "@/components/DocumentList/components/FolderIcon";
import { FolderPlus, Grid, Tags, Tag, FileText, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Document } from "@/components/DocumentList/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface FolderManagementProps {
  documents: Document[];
}

export const FolderManagement = ({ documents }: FolderManagementProps) => {
  const [showFolderDialog, setShowFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [activeView, setActiveView] = useState<"all" | "uncategorized" | "folders">("all");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

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
    } catch (error) {
      console.error('Error moving document:', error);
      toast.error("Failed to move document");
    }
    setIsDragging(false);
  };

  const folders = documents.filter(doc => doc.is_folder);
  const uncategorizedDocuments = documents.filter(doc => !doc.is_folder && !doc.parent_folder_id);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-xl">Document Management</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  View Options
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Document Views</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveView("all")}>
                  <Grid className="h-4 w-4 mr-2" />
                  All Documents
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveView("folders")}>
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Folder View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveView("uncategorized")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Uncategorized
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex gap-2">
            <Dialog open={showFolderDialog} onOpenChange={setShowFolderDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gradient-button">
                  <FolderPlus className="h-4 w-4 mr-2" />
                  New Folder
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-panel">
                <DialogHeader>
                  <DialogTitle>Create New Folder</DialogTitle>
                  <DialogDescription>
                    Enter a name for your new folder. You can drag and drop documents into it later.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input
                    placeholder="Folder name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="glass-panel"
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowFolderDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateFolder} className="gradient-button">
                    Create Folder
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
            <ScrollArea className="h-[400px]">
              <div 
                className={cn(
                  "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
                  isDragging && "ring-2 ring-primary/50 rounded-lg p-4"
                )}
              >
                {folders.map((folder) => {
                  const folderDocuments = documents.filter(d => d.parent_folder_id === folder.id);
                  const isSelected = selectedFolder === folder.id;
                  
                  return (
                    <div
                      key={folder.id}
                      className={cn(
                        "p-4 rounded-lg glass-panel hover:shadow-lg transition-all duration-200 card-highlight",
                        isSelected && "ring-2 ring-primary"
                      )}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => handleDocumentDrop(e, folder.id)}
                      onClick={() => setSelectedFolder(isSelected ? null : folder.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <FolderIcon 
                          variant="client" 
                          isActive={isSelected}
                          isOpen={isSelected}
                        />
                        <div>
                          <h4 className="font-medium text-lg">{folder.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {folderDocuments.length} documents
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="uncategorized">
            <ScrollArea className="h-[400px]">
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {uncategorizedDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center p-4 rounded-lg glass-panel hover:shadow-lg transition-all duration-200 card-highlight"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('documentId', doc.id);
                    }}
                  >
                    <div className="p-2 rounded-md bg-primary/10 mr-3">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{doc.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {doc.type || 'Document'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
