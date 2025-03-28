
import { Loader2 } from "lucide-react";

export const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 p-6">
      <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
      <h3 className="text-lg font-medium">Loading folders...</h3>
      <p className="text-sm text-muted-foreground">Please wait while we load your documents and folders.</p>
    </div>
  );
};
