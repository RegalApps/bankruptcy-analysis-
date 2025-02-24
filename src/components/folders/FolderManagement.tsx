
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FolderIcon } from "@/components/DocumentList/components/FolderIcon";
import { FolderPlus, Grid, Tags, Tag, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Document } from "@/components/DocumentList/types";

interface FolderManagementProps {
  documents: Document[];
}

export const FolderManagement = ({ documents }: FolderManagementProps) => {
  const [showFolderDialog, setShowFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isDragging, setIsDragging] = useState(false);

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
    } catch (error) {
      console.error('Error creating folder:', error);
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
    } catch (error) {
      console.error('Error moving document:', error);
    }
  };

  // Get folders and uncategorized documents
  const folders = documents.filter(doc => doc.is_folder);
  const uncategorizedDocuments = documents.filter(doc => !doc.is_folder && !doc.parent_folder_id);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Folder Management</h3>
          <div className="flex gap-2">
            <Dialog open={showFolderDialog} onOpenChange={setShowFolderDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <FolderPlus className="h-4 w-4 mr-2" />
                  New Folder
                </Button>
              </DialogTrigger>
              <DialogContent>
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
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowFolderDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateFolder}>
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
            <Button variant="outline" size="sm">
              <Grid className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
        </div>
        <ScrollArea className="h-[400px]">
          <div className="grid gap-6">
            <div 
              className={cn(
                "grid gap-4 md:grid-cols-2",
                isDragging && "ring-2 ring-primary/50 rounded-lg p-4"
              )}
            >
              {folders.map((folder) => {
                const folderDocuments = documents.filter(d => d.parent_folder_id === folder.id);
                return (
                  <div
                    key={folder.id}
                    className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      setIsDragging(false);
                      handleDocumentDrop(e, folder.id);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <FolderIcon variant="client" />
                      <div>
                        <h4 className="font-medium">{folder.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {folderDocuments.length} documents
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {uncategorizedDocuments.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-sm text-muted-foreground mb-3">Uncategorized Documents</h4>
                <div className="grid gap-3 md:grid-cols-2">
                  {uncategorizedDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center p-3 rounded-lg border bg-card hover:shadow-md transition-shadow"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('documentId', doc.id);
                      }}
                    >
                      <div className="p-2 rounded-md bg-primary/10 mr-3">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{doc.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {doc.type || 'Document'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};
