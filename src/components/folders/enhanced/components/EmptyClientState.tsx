
import { Users } from "lucide-react";

export const EmptyClientState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 p-6">
      <div className="bg-muted rounded-full p-3 mb-4">
        <Users className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">No documents for this client</h3>
      <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
        This client doesn't have any documents or folders yet. Upload some documents to get started.
      </p>
    </div>
  );
};
