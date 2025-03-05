
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FolderStructure } from "@/types/folders";
import { supabase } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateFolderDialogProps {
  folders: FolderStructure[];
  onClose: () => void;
  onCreateFolder: () => void;
}

export const CreateFolderDialog = ({
  folders,
  onClose,
  onCreateFolder
}: CreateFolderDialogProps) => {
  const [folderName, setFolderName] = useState("");
  const [parentFolderId, setParentFolderId] = useState<string>("");
  const [folderType, setFolderType] = useState<'client' | 'form' | 'financial' | 'general'>('general');
  const [isCreating, setIsCreating] = useState(false);
  
  // Get top-level folders for parent selection
  const topLevelFolders = folders.filter(folder => folder.level === 0);
  
  const handleCreateFolder = async () => {
    if (!folderName.trim()) return;
    
    setIsCreating(true);
    
    try {
      // Get user for ownership
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      // Determine folder level
      const level = parentFolderId ? 
        (folders.find(f => f.id === parentFolderId)?.level ?? 0) + 1 : 
        0;
      
      // Create folder in the documents table
      const { data, error } = await supabase
        .from('documents')
        .insert({
          title: folderName,
          type: 'folder',
          is_folder: true,
          folder_type: folderType,
          parent_folder_id: parentFolderId || null,
          metadata: {
            level,
            created_by: user.id,
            created_at: new Date().toISOString()
          },
          user_id: user.id
        })
        .select()
        .single();
        
      if (error) throw error;
      
      onCreateFolder();
      onClose();
    } catch (error) {
      console.error("Error creating folder:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              placeholder="Enter folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="folder-type">Folder Type</Label>
            <Select value={folderType} onValueChange={(value: any) => setFolderType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select folder type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="form">Forms</SelectItem>
                  <SelectItem value="financial">Financial Sheets</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="parent-folder">Parent Folder (Optional)</Label>
            <Select value={parentFolderId} onValueChange={setParentFolderId}>
              <SelectTrigger>
                <SelectValue placeholder="Select parent folder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None (Top Level)</SelectItem>
                {topLevelFolders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCreateFolder} disabled={!folderName.trim() || isCreating}>
            {isCreating ? "Creating..." : "Create Folder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
