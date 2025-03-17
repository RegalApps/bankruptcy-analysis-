
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

interface ClientHeaderProps {
  onBack: () => void;
}

export const ClientHeader = ({ onBack }: ClientHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Brain className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold">Client Assistant</h2>
      </div>
      <Button variant="outline" onClick={onBack}>
        Back to Clients
      </Button>
    </div>
  );
};
