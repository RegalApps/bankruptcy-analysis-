
import { Button } from "@/components/ui/button";
import { DocumentUploadButton } from "../DocumentUploadButton";
import { Grid, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  selectedFolder: string | null;
  isGridView: boolean;
  setIsGridView: (value: boolean) => void;
}

export const Toolbar = ({
  selectedFolder,
  isGridView,
  setIsGridView
}: ToolbarProps) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-semibold">
        {selectedFolder || "All Documents"}
      </h2>
      <div className="flex items-center gap-2">
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
