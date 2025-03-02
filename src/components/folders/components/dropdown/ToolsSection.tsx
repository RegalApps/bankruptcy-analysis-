
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { FolderPen, FilePen, FolderSync, Trash2 } from "lucide-react";

interface ToolsSectionProps {
  handleToolAction: (action: 'rename' | 'delete' | 'merge', type?: 'folder' | 'file') => void;
  isFileActionDisabled: (actionType: 'folder' | 'file') => boolean;
}

export const ToolsSection = ({
  handleToolAction,
  isFileActionDisabled
}: ToolsSectionProps) => {
  return (
    <>
      <DropdownMenuItem 
        onClick={() => handleToolAction('rename', 'folder')}
        disabled={isFileActionDisabled('folder')}
        className={isFileActionDisabled('folder') ? "opacity-50 cursor-not-allowed" : ""}
      >
        <FolderPen className="h-4 w-4 mr-2" />
        Rename Folder
      </DropdownMenuItem>
      
      <DropdownMenuItem 
        onClick={() => handleToolAction('rename', 'file')}
        disabled={isFileActionDisabled('file')}
        className={isFileActionDisabled('file') ? "opacity-50 cursor-not-allowed" : ""}
      >
        <FilePen className="h-4 w-4 mr-2" />
        Rename File
      </DropdownMenuItem>
      
      <DropdownMenuItem 
        onClick={() => handleToolAction('merge')}
      >
        <FolderSync className="h-4 w-4 mr-2" />
        Merge Client Folders
      </DropdownMenuItem>
      
      <DropdownMenuItem 
        onClick={() => handleToolAction('delete', 'folder')}
        disabled={isFileActionDisabled('folder')}
        className={`${isFileActionDisabled('folder') ? "opacity-50 cursor-not-allowed" : ""} text-destructive focus:text-destructive`}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete Folder
      </DropdownMenuItem>
      
      <DropdownMenuItem 
        onClick={() => handleToolAction('delete', 'file')}
        disabled={isFileActionDisabled('file')}
        className={`${isFileActionDisabled('file') ? "opacity-50 cursor-not-allowed" : ""} text-destructive focus:text-destructive`}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete File
      </DropdownMenuItem>
    </>
  );
};
