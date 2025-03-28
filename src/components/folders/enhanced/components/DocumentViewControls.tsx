
import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid, List, UploadCloud } from 'lucide-react';

interface DocumentViewControlsProps {
  isGridView: boolean;
  setIsGridView: (isGrid: boolean) => void;
  onUploadClick?: () => void;
}

export const DocumentViewControls = ({
  isGridView,
  setIsGridView,
  onUploadClick
}: DocumentViewControlsProps) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="bg-muted rounded-md p-1 flex">
        <Button
          variant={isGridView ? "default" : "ghost"}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setIsGridView(true)}
          title="Grid View"
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          variant={!isGridView ? "default" : "ghost"}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setIsGridView(false)}
          title="List View"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
      
      {onUploadClick && (
        <Button
          variant="outline"
          size="sm"
          onClick={onUploadClick}
          className="ml-2"
        >
          <UploadCloud className="h-4 w-4 mr-1" />
          Upload
        </Button>
      )}
    </div>
  );
};
