
import { Folder } from "lucide-react";

export const EmptyFolderState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 p-6">
      <div className="bg-muted rounded-full p-3 mb-4">
        <Folder className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">No folders found</h3>
      <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
        No folders match your current search criteria. Try adjusting your search or filters.
      </p>
    </div>
  );
};
