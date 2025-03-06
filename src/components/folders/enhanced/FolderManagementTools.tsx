
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FolderPlus, 
  Trash2, 
  FolderSymlink, 
  ChevronDown,
  Search
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Document } from "@/components/DocumentList/types";

interface FolderManagementToolsProps {
  documents: Document[];
  onRefresh: () => void;
  selectedFolderId?: string;
}

export function FolderManagementTools({ 
  documents, 
  onRefresh, 
  selectedFolderId 
}: FolderManagementToolsProps) {
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false);
  const [clientSearchOpen, setClientSearchOpen] = useState(false);
  
  // Form states
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderType, setNewFolderType] = useState("general");
  const [targetFolderId, setTargetFolderId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Folder management operations
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Extract client names from documents for filtering
  const clientFolders = documents.filter(doc => 
    doc.is_folder && doc.folder_type === 'client'
  );
  
  // Get all Form 47 or Form 76 documents
  const formDocuments = documents.filter(doc => 
    !doc.is_folder && (
      doc.metadata?.formType === 'form-47' || 
      doc.metadata?.formType === 'form-76' ||
      doc.title?.toLowerCase().includes('form 47') || 
      doc.title?.toLowerCase().includes('form 76')
    )
  );
  
  // Helper function to handle client folder selection
  const handleClientSelect = (clientFolderId: string) => {
    if (!clientFolderId) return;
    
    // Find the folder in documents
    const folder = documents.find(doc => doc.id === clientFolderId);
    if (folder) {
      // Navigate to this folder (we'll simulate by refreshing and selecting it)
      toast.success(`Navigated to ${folder.title}`);
      onRefresh();
    }
  };
  
  // Create a new folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error("Folder name cannot be empty");
      return;
    }
    
    setIsProcessing(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('documents')
        .insert({
          title: newFolderName,
          is_folder: true,
          folder_type: newFolderType,
          parent_folder_id: selectedFolderId || null,
          user_id: userData.user.id,
          type: 'folder',
          size: 0
        })
        .select();
        
      if (error) throw error;
      
      toast.success(`Folder "${newFolderName}" created successfully`);
      setNewFolderName("");
      setCreateDialogOpen(false);
      onRefresh();
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error("Failed to create folder. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Delete a folder
  const handleDeleteFolder = async () => {
    if (!selectedFolderId) {
      toast.error("No folder selected");
      return;
    }
    
    setIsProcessing(true);
    try {
      // First check if folder has documents or subfolders
      const { data: folderContents, error: checkError } = await supabase
        .from('documents')
        .select('id')
        .eq('parent_folder_id', selectedFolderId);
        
      if (checkError) throw checkError;
      
      if (folderContents && folderContents.length > 0) {
        toast.error("Cannot delete folder with contents. Move or delete contents first.");
        setDeleteDialogOpen(false);
        return;
      }
      
      // Delete the folder
      const { error: deleteError } = await supabase
        .from('documents')
        .delete()
        .eq('id', selectedFolderId);
        
      if (deleteError) throw deleteError;
      
      toast.success("Folder deleted successfully");
      setDeleteDialogOpen(false);
      onRefresh();
    } catch (error) {
      console.error("Error deleting folder:", error);
      toast.error("Failed to delete folder. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Merge folders
  const handleMergeFolders = async () => {
    if (!selectedFolderId || !targetFolderId) {
      toast.error("Both source and target folders must be selected");
      return;
    }
    
    if (selectedFolderId === targetFolderId) {
      toast.error("Cannot merge a folder with itself");
      return;
    }
    
    setIsProcessing(true);
    try {
      // Move all contents from selected folder to target folder
      const { error: moveError } = await supabase
        .from('documents')
        .update({ parent_folder_id: targetFolderId })
        .eq('parent_folder_id', selectedFolderId);
        
      if (moveError) throw moveError;
      
      // Delete the now-empty source folder
      const { error: deleteError } = await supabase
        .from('documents')
        .delete()
        .eq('id', selectedFolderId);
        
      if (deleteError) throw deleteError;
      
      toast.success("Folders merged successfully");
      setMergeDialogOpen(false);
      setTargetFolderId("");
      onRefresh();
    } catch (error) {
      console.error("Error merging folders:", error);
      toast.error("Failed to merge folders. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Find a form document
  const handleFindForm = (formId: string) => {
    if (!formId) return;
    
    const form = documents.find(doc => doc.id === formId);
    if (!form) {
      toast.error("Form not found");
      return;
    }
    
    // If the form has a parent folder, we can navigate to that folder
    if (form.parent_folder_id) {
      toast.success(`Form "${form.title}" found`);
      onRefresh();
    } else {
      toast.info(`Form "${form.title}" is not in any folder`);
    }
  };

  const filteredFormDocuments = formDocuments.filter(doc => 
    doc.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {/* Create Folder Button & Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <FolderPlus className="h-4 w-4 mr-2" />
            Create Folder
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Enter a name for your new folder.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="folder-name" className="text-sm font-medium">
                Folder Name
              </label>
              <Input
                id="folder-name"
                placeholder="Enter folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="folder-type" className="text-sm font-medium">
                Folder Type
              </label>
              <Select 
                value={newFolderType} 
                onValueChange={setNewFolderType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select folder type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="form">Form</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateFolder} 
              disabled={isProcessing || !newFolderName.trim()}
            >
              {isProcessing ? "Creating..." : "Create Folder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Folder Button & Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline"
            size="sm"
            disabled={!selectedFolderId}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Folder
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Folder</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this folder? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteFolder}
              disabled={isProcessing}
            >
              {isProcessing ? "Deleting..." : "Delete Folder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Merge Folders Button & Dialog */}
      <Dialog open={mergeDialogOpen} onOpenChange={setMergeDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline"
            size="sm"
            disabled={!selectedFolderId}
          >
            <FolderSymlink className="h-4 w-4 mr-2" />
            Merge Folders
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Merge Folders</DialogTitle>
            <DialogDescription>
              Select a target folder to merge the currently selected folder into.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="target-folder" className="text-sm font-medium">
                Target Folder
              </label>
              <Select 
                value={targetFolderId} 
                onValueChange={setTargetFolderId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select target folder" />
                </SelectTrigger>
                <SelectContent>
                  {documents
                    .filter(doc => doc.is_folder && doc.id !== selectedFolderId)
                    .map(folder => (
                      <SelectItem key={folder.id} value={folder.id}>
                        {folder.title}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setMergeDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleMergeFolders} 
              disabled={isProcessing || !targetFolderId}
            >
              {isProcessing ? "Merging..." : "Merge Folders"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Client Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Clients
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56 max-h-80 overflow-y-auto">
          {clientFolders.length > 0 ? (
            clientFolders.map(client => (
              <DropdownMenuItem 
                key={client.id}
                onClick={() => handleClientSelect(client.id)}
              >
                {client.title}
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>No client folders found</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Form Search Dialog */}
      <Dialog open={clientSearchOpen} onOpenChange={setClientSearchOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Find Forms
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Find Forms</DialogTitle>
            <DialogDescription>
              Search for Form 47 or Form 76 documents.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex w-full items-center space-x-2">
              <Input
                placeholder="Search forms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto border rounded-md p-2">
              {filteredFormDocuments.length > 0 ? (
                filteredFormDocuments.map(form => (
                  <div 
                    key={form.id}
                    className="p-2 hover:bg-accent rounded-md cursor-pointer flex justify-between"
                    onClick={() => handleFindForm(form.id)}
                  >
                    <span className="truncate">{form.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(form.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-2 text-center text-muted-foreground">
                  {searchQuery ? "No forms found matching your search" : "No form documents found"}
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setClientSearchOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
