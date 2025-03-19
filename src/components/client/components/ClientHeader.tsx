
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientHeaderProps {
  onBack: () => void;
}

export const ClientHeader = ({ onBack }: ClientHeaderProps) => {
  return (
    <div className="flex items-center p-4">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mr-2"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </Button>
      <h2 className="text-lg font-semibold">Client Viewer</h2>
    </div>
  );
};
