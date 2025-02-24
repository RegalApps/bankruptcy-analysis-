
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FolderIcon } from "@/components/DocumentList/components/FolderIcon";
import { FolderPlus, Grid, Tags, Tag } from "lucide-react";
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

  return (
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
        <div 
          className={cn(
            "grid gap-4 md:grid-cols-2",
            isDragging && "ring-2 ring-primary/50 rounded-lg p-4"
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            // Handle drop logic here
          }}
        >
          {Object.entries(documents.reduce((acc, doc) => {
            if (doc.is_folder) {
              acc[doc.title] = {
                id: doc.id,
                documents: documents.filter(d => d.parent_folder_id === doc.id)
              };
            }
            return acc;
          }, {} as Record<string, { id: string; documents: typeof documents }>)).map(([folderName, folder]) => (
            <div
              key={folder.id}
              className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
              draggable
            >
              <div className="flex items-center space-x-3">
                <FolderIcon variant="client" />
                <div>
                  <h4 className="font-medium">{folderName}</h4>
                  <p className="text-sm text-muted-foreground">
                    {folder.documents.length} documents
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
