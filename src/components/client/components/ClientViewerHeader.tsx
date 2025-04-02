
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface ClientViewerHeaderProps {
  isLoading: boolean;
  clientName?: string;
  onBack: () => void;
}

export const ClientViewerHeader = ({ isLoading, clientName, onBack }: ClientViewerHeaderProps) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onBack}
        className="flex items-center"
      >
        <ChevronLeft className="h-4 w-4 mr-1" /> 
        Back to Documents
      </Button>
      
      {!isLoading && clientName && (
        <div className="flex items-center">
          <span className="text-sm text-muted-foreground mr-2">Last edited: Today at 10:45 AM</span>
          <Button size="sm">New Document</Button>
        </div>
      )}
    </div>
  );
};
