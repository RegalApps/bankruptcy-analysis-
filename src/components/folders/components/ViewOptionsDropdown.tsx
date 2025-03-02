
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Settings } from "lucide-react";
import { RenameDialog } from "./dialogs/RenameDialog";
import { DeleteDialog } from "./dialogs/DeleteDialog";
import { MergeDialog } from "./dialogs/MergeDialog"; 
import { ViewsSection } from "./dropdown/ViewsSection";
import { ToolsSection } from "./dropdown/ToolsSection";
import { useViewOptionsActions } from "./dropdown/useViewOptionsActions";
import { useMergeFoldersHandler } from "./dropdown/MergeFoldersHandler";

interface ViewOptionsDropdownProps {
  onViewChange: (view: "all" | "uncategorized" | "folders") => void;
  selectedItemId?: string;
  selectedItemType?: "folder" | "file";
  onRefresh?: () => void;
  updateMergeableClientFolders?: (mergeables: Record<string, string[]>) => void;
  updateHighlightMergeTargets?: (highlight: boolean) => void;
}

export const ViewOptionsDropdown = ({ 
  onViewChange, 
  selectedItemId,
  selectedItemType,
  onRefresh,
  updateMergeableClientFolders,
  updateHighlightMergeTargets 
}: ViewOptionsDropdownProps) => {
  const {
    isRenameDialogOpen, setIsRenameDialogOpen,
    isDeleteDialogOpen, setIsDeleteDialogOpen,
    isMergeDialogOpen, setIsMergeDialogOpen,
    newName, setNewName,
    clientName, setClientName,
    actionType, isMerging,
    mergeableClientFolders, setMergeableClientFolders,
    folderNames, setFolderNames,
    handleRename, handleDelete, handleMerge, 
    handleToolAction, isFileActionDisabled
  } = useViewOptionsActions({ onRefresh, updateMergeableClientFolders, updateHighlightMergeTargets });

  const {
    handleClientNameChange,
    handlePreviewMerge,
    handleCancelPreview
  } = useMergeFoldersHandler({
    clientName,
    setMergeableClientFolders,
    setFolderNames,
    updateMergeableClientFolders,
    updateHighlightMergeTargets
  });

  // Create specific handlers for the current item
  const onRename = () => handleRename(selectedItemId);
  const onDelete = () => handleDelete(selectedItemId);
  
  // Check if file actions should be disabled for current selection
  const checkIsFileActionDisabled = (actionType: 'folder' | 'file') => 
    isFileActionDisabled(actionType, selectedItemId, selectedItemType);

  return (
    <>
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
          
          <ViewsSection onViewChange={onViewChange} />
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>
            <Settings className="h-4 w-4 inline mr-2" />
            Tools
          </DropdownMenuLabel>
          
          <ToolsSection 
            handleToolAction={handleToolAction}
            isFileActionDisabled={checkIsFileActionDisabled}
          />
        </DropdownMenuContent>
      </DropdownMenu>

      <RenameDialog
        isOpen={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
        itemType={actionType}
        newName={newName}
        onNewNameChange={setNewName}
        onRename={onRename}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        itemType={actionType}
        onDelete={onDelete}
      />

      <MergeDialog
        isOpen={isMergeDialogOpen}
        onOpenChange={setIsMergeDialogOpen}
        clientName={clientName}
        onClientNameChange={setClientName}
        onMerge={handleMerge}
        mergeableClientFolders={mergeableClientFolders}
        onPreviewMerge={handlePreviewMerge}
        onCancelPreview={handleCancelPreview}
        isMerging={isMerging}
        folderNames={folderNames}
      />
    </>
  );
};
