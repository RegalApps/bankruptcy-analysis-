
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Grid, FolderPlus, FileText } from "lucide-react";

interface ViewOptionsDropdownProps {
  onViewChange: (view: "all" | "uncategorized" | "folders") => void;
}

export const ViewOptionsDropdown = ({ onViewChange }: ViewOptionsDropdownProps) => {
  return (
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
        <DropdownMenuItem onClick={() => onViewChange("all")}>
          <Grid className="h-4 w-4 mr-2" />
          All Documents
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onViewChange("folders")}>
          <FolderPlus className="h-4 w-4 mr-2" />
          Folder View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onViewChange("uncategorized")}>
          <FileText className="h-4 w-4 mr-2" />
          Uncategorized
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
