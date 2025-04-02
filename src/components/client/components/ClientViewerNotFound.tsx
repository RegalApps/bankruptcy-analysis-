
import { Button } from "@/components/ui/button";

interface ClientViewerNotFoundProps {
  onBack: () => void;
}

export const ClientViewerNotFound = ({ onBack }: ClientViewerNotFoundProps) => {
  return (
    <div className="border rounded-lg bg-card p-4 text-center">
      <h2 className="text-lg font-semibold mb-2">Client Not Found</h2>
      <p className="text-muted-foreground mb-4">The client you're looking for doesn't exist or you don't have access.</p>
      <Button onClick={onBack}>Return to Documents</Button>
    </div>
  );
};
