
import React from 'react';
import { Button } from '@/components/ui/button';
import { FolderPlus, RefreshCw, FolderInput } from 'lucide-react';

interface FolderToolsProps {
  onCreateFolder: () => void;
  onRefresh: () => void;
  onImport?: () => void;
  isRefreshing?: boolean;
}

export const FolderTools = ({
  onCreateFolder,
  onRefresh,
  onImport,
  isRefreshing = false
}: FolderToolsProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onCreateFolder}
        className="gap-1"
      >
        <FolderPlus className="h-4 w-4" />
        New Folder
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onRefresh}
        className={isRefreshing ? 'animate-spin' : ''}
        title="Refresh folder list"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>

      {onImport && (
        <Button
          variant="outline"
          size="sm"
          onClick={onImport}
          className="gap-1"
        >
          <FolderInput className="h-4 w-4" />
          Import
        </Button>
      )}
    </div>
  );
};
