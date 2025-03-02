
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Grid, FolderPlus, FileText } from "lucide-react";

interface ViewsSectionProps {
  onViewChange: (view: "all" | "uncategorized" | "folders") => void;
}

export const ViewsSection = ({ onViewChange }: ViewsSectionProps) => {
  return (
    <>
      <DropdownMenuItem onClick={() => onViewChange("all")} role="button">
        <Grid className="h-4 w-4 mr-2" />
        All Documents
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onViewChange("folders")} role="button">
        <FolderPlus className="h-4 w-4 mr-2" />
        Folder View
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onViewChange("uncategorized")} role="button">
        <FileText className="h-4 w-4 mr-2" />
        Uncategorized
      </DropdownMenuItem>
    </>
  );
};
