
import { FolderIcon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onRefresh: () => void;
}

export const EmptyState = ({ onRefresh }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 p-6">
      <div className="bg-muted rounded-full p-3 mb-4">
        <FolderIcon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">No documents or folders found</h3>
      <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
        You don't have any documents or folders yet. Upload some documents or create a folder to get started.
      </p>
      <Button variant="outline" onClick={onRefresh}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh
      </Button>
    </div>
  );
};
