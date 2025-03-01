
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { FolderSync } from "lucide-react";

interface MergeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  clientName: string;
  onClientNameChange: (value: string) => void;
  onMerge: () => void;
  mergeableClientFolders?: Record<string, string[]>;
  onPreviewMerge: (clientName: string) => void;
  onCancelPreview: () => void;
  isMerging: boolean;
  folderNames?: Record<string, string>;
}

export const MergeDialog = ({
  isOpen,
  onOpenChange,
  clientName,
  onClientNameChange,
  onMerge,
  mergeableClientFolders = {},
  onPreviewMerge,
  onCancelPreview,
  isMerging,
  folderNames = {}
}: MergeDialogProps) => {
  const [debouncedClientName, setDebouncedClientName] = useState(clientName);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      if (debouncedClientName.trim()) {
        onPreviewMerge(debouncedClientName);
      } else {
        onCancelPreview();
      }
    }, 500);
    
    return () => clearTimeout(handler);
  }, [debouncedClientName, onPreviewMerge, onCancelPreview]);
  
  const handleClientNameChange = (value: string) => {
    onClientNameChange(value);
    setDebouncedClientName(value);
  };
  
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      onCancelPreview();
    }
    onOpenChange(open);
  };
  
  const hasMergeableFolders = Object.keys(mergeableClientFolders).length > 0;
  
  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Merge Client Folders</DialogTitle>
          <DialogDescription>
            Enter a client name to merge all related folders. This will combine documents from similarly named client folders into one folder.
          </DialogDescription>
        </DialogHeader>
        <Input
          value={clientName}
          onChange={(e) => handleClientNameChange(e.target.value)}
          placeholder="Enter client name"
          className="my-4"
        />
        
        {clientName.trim() && (
          <div className="mt-2">
            {hasMergeableFolders ? (
              <div className="space-y-3">
                <p className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center">
                  <FolderSync className="h-4 w-4 mr-2" />
                  Found {Object.values(mergeableClientFolders).reduce((acc, folders) => acc + folders.length, 0)} folders to merge
                </p>
                {Object.entries(mergeableClientFolders).map(([targetId, folderIds]) => (
                  <div key={targetId} className="p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium mb-2">Target folder: {folderNames[targetId] || "New Folder"}</p>
                    <div className="flex flex-wrap gap-2">
                      {folderIds.map(id => (
                        <Badge key={id} variant="outline">
                          {folderNames[id] || id.substring(0, 8)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-amber-600 dark:text-amber-400">
                No similar client folders found to merge
              </p>
            )}
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => handleDialogClose(false)}>
            Cancel
          </Button>
          <Button 
            onClick={onMerge} 
            disabled={!hasMergeableFolders || isMerging}
          >
            {isMerging ? "Merging..." : "Merge Folders"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
