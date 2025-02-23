
import { Button } from "@/components/ui/button";
import { DocumentUploadButton } from "../DocumentUploadButton";
import { Grid, List, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ToolbarProps {
  selectedFolder: string | null;
  isGridView: boolean;
  setIsGridView: (value: boolean) => void;
  onFilterChange: (type: string | null) => void;
  currentFilter: string | null;
}

export const Toolbar = ({
  selectedFolder,
  isGridView,
  setIsGridView,
  onFilterChange,
  currentFilter
}: ToolbarProps) => {
  const documentTypes = [
    "PDF Document",
    "Word Document",
    "Excel Spreadsheet",
    "Text Document",
    "Other"
  ];

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-semibold">
        {selectedFolder || "All Documents"}
      </h2>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              {currentFilter || "All Types"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onFilterChange(null)}>
              All Types
            </DropdownMenuItem>
            {documentTypes.map(type => (
              <DropdownMenuItem 
                key={type}
                onClick={() => onFilterChange(type)}
              >
                {type}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsGridView(true)}
          className={cn(isGridView && "bg-accent")}
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsGridView(false)}
          className={cn(!isGridView && "bg-accent")}
        >
          <List className="h-4 w-4" />
        </Button>
        <DocumentUploadButton />
      </div>
    </div>
  );
};
