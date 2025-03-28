
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientNotFoundProps {
  onBack: () => void;
}

export const ClientNotFound = ({ onBack }: ClientNotFoundProps) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      <div className="bg-primary/10 rounded-full p-3 mb-4">
        <Search className="h-6 w-6 text-primary" />
      </div>
      <h2 className="text-xl font-medium mb-2">Client Not Found</h2>
      <p className="text-center text-muted-foreground mb-6 max-w-md">
        We couldn't find the client you're looking for. They may have been removed or you might not have access.
      </p>
      <Button onClick={onBack} className="flex items-center">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Documents
      </Button>
    </div>
  );
};
