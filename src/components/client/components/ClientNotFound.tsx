
import { UserX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientNotFoundProps {
  onBack: () => void;
}

export const ClientNotFound = ({ onBack }: ClientNotFoundProps) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      <div className="text-muted-foreground">
        <UserX className="h-16 w-16 mx-auto mb-4" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Client Not Found</h2>
      <p className="text-muted-foreground text-center mb-6 max-w-md">
        We couldn't find the client you're looking for. They may have been removed or you might not have permission to view their information.
      </p>
      <Button onClick={onBack}>
        Go Back
      </Button>
    </div>
  );
};
