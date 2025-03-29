
import React from "react";
import { Button } from "@/components/ui/button";
import { FolderOpen, RefreshCw } from "lucide-react";

interface EmptyStateProps {
  onRefresh?: () => void;
}

export const EmptyState = ({ onRefresh }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 h-[400px] text-center">
      <div className="bg-primary/10 p-4 rounded-full mb-4">
        <FolderOpen className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No Documents Found</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        There are no documents available. Upload some documents to get started.
      </p>
      {onRefresh && (
        <Button onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      )}
    </div>
  );
};
