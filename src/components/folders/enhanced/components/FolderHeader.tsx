
import { Grid, List, RefreshCw, Folder, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FolderHeaderProps {
  isGridView: boolean;
  setIsGridView: (isGrid: boolean) => void;
  selectedFolderId: string | null;
  onRefresh?: () => void;
}

export const FolderHeader = ({
  isGridView,
  setIsGridView,
  selectedFolderId,
  onRefresh
}: FolderHeaderProps) => {
  return (
    <div className="py-2 px-4 border-b flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <Folder className="h-5 w-5 text-primary mr-2" />
          <h2 className="text-lg font-medium">
            {selectedFolderId ? 'Folder Contents' : 'All Documents'}
          </h2>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {onRefresh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
        
        <div className="flex border rounded-md">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 p-0 rounded-none",
              !isGridView && "bg-muted"
            )}
            onClick={() => setIsGridView(false)}
            title="List View"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 p-0 rounded-none",
              isGridView && "bg-muted"
            )}
            onClick={() => setIsGridView(true)}
            title="Grid View"
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
