
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Folder, Plus, FolderPlus, Users, FileSpreadsheet } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Document } from "@/components/DocumentList/types";
import { createFolderIfNotExists } from "@/utils/documents/folder-utils/createFolder";

interface FolderManagementToolsProps {
  documents: Document[];
  onRefresh: () => void;
  selectedFolderId?: string;
}

export const FolderManagementTools = ({
  documents,
  onRefresh,
  selectedFolderId
}: FolderManagementToolsProps) => {
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [folderType, setFolderType] = useState<string>("general");
  const [parentFolderId, setParentFolderId] = useState<string | undefined>(selectedFolderId);
  const [clientName, setClientName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  
  // Get folder list for parent folder selection
  const folderOptions = documents
    .filter(doc => doc.is_folder)
    .map(folder => ({
      id: folder.id,
      name: folder.title,
      type: folder.folder_type || "general"
    }));
    
  // Get client folders specifically
  const clientFolders = folderOptions.filter(folder => 
    folder.type === "client"
  );
  
  // Handle folder creation
  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      toast.error("Please enter a folder name");
      return;
    }
    
    try {
      setIsCreatingFolder(true);
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      if (!user) {
        toast.error("You must be logged in to create folders");
        return;
      }
      
      let finalParentId = parentFolderId;
      
      // If creating a subfolder under a client (Forms, Financial, etc.)
      if (folderType !== "client" && clientName) {
        // Find or create the client folder first
        const clientFolderId = await createFolderIfNotExists(
          clientName,
          "client",
          user.id
        );
        
        finalParentId = clientFolderId;
      }
      
      // Create the folder
      const newFolderId = await createFolderIfNotExists(
        folderName,
        folderType,
        user.id,
        finalParentId
      );
      
      // If this is a client folder, automatically create standard subfolders
      if (folderType === "client") {
        // Create Forms folder
        await createFolderIfNotExists(
          "Forms",
          "form",
          user.id,
          newFolderId
        );
        
        // Create Financial Sheets folder
        await createFolderIfNotExists(
          "Financial Sheets",
          "financial",
          user.id,
          newFolderId
        );
        
        // Create Documents folder
        await createFolderIfNotExists(
          "Documents",
          "general",
          user.id,
          newFolderId
        );
      }
      
      toast.success(`Folder ${folderName} created successfully`);
      setIsCreateFolderOpen(false);
      setFolderName("");
      setFolderType("general");
      setParentFolderId(undefined);
      setClientName("");
      onRefresh();
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error("Failed to create folder");
    } finally {
      setIsCreatingFolder(false);
    }
  };
  
  return (
    <div className="mb-4 flex justify-between items-center">
      <div className="flex gap-2">
        <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <FolderPlus className="h-4 w-4" />
              <span>Create Folder</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="folderType">Folder Type</Label>
                <RadioGroup 
                  value={folderType} 
                  onValueChange={setFolderType}
                  className="flex gap-4"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="client" id="client" />
                    <Label htmlFor="client" className="flex items-center gap-1 cursor-pointer">
                      <Users className="h-4 w-4" />
                      Client
                    </Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="form" id="form" />
                    <Label htmlFor="form" className="flex items-center gap-1 cursor-pointer">
                      <Folder className="h-4 w-4" />
                      Forms
                    </Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="financial" id="financial" />
                    <Label htmlFor="financial" className="flex items-center gap-1 cursor-pointer">
                      <FileSpreadsheet className="h-4 w-4" />
                      Financial
                    </Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="general" id="general" />
                    <Label htmlFor="general" className="flex items-center gap-1 cursor-pointer">
                      <Folder className="h-4 w-4" />
                      General
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="folderName">Folder Name</Label>
                <Input
                  id="folderName"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder={folderType === "client" ? "Client Name" : "Folder Name"}
                />
              </div>
              
              {folderType !== "client" && (
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Folder</Label>
                  <Select
                    value={clientName}
                    onValueChange={setClientName}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client folder or create new" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None (Create at root)</SelectItem>
                      {clientFolders.map(folder => (
                        <SelectItem key={folder.id} value={folder.name}>
                          {folder.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="new">+ Create New Client</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {clientName === "new" && (
                    <div className="pt-2">
                      <Label htmlFor="newClientName">New Client Name</Label>
                      <Input
                        id="newClientName"
                        value=""
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Enter new client name"
                      />
                    </div>
                  )}
                </div>
              )}
              
              {folderType !== "client" && !clientName && (
                <div className="space-y-2">
                  <Label htmlFor="parentFolder">Parent Folder (Optional)</Label>
                  <Select
                    value={parentFolderId}
                    onValueChange={(value) => setParentFolderId(value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a parent folder (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None (Root folder)</SelectItem>
                      {folderOptions.map(folder => (
                        <SelectItem key={folder.id} value={folder.id}>
                          {folder.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateFolderOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateFolder} disabled={isCreatingFolder}>
                {isCreatingFolder ? "Creating..." : "Create Folder"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onRefresh}
          className="flex items-center gap-2"
        >
          <svg 
            className="h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
          </svg>
          <span>Refresh</span>
        </Button>
      </div>
    </div>
  );
};
