
import { Button } from "@/components/ui/button";
import { ChevronLeft, Mail, Calendar } from "lucide-react";

interface ClientHeaderProps {
  onBack: () => void;
}

export const ClientHeader = ({ onBack }: ClientHeaderProps) => {
  return (
    <div className="flex items-center justify-between border-b pb-3">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back
      </Button>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Mail className="h-4 w-4 mr-1.5" />
          Contact
        </Button>
        <Button variant="outline" size="sm">
          <Calendar className="h-4 w-4 mr-1.5" />
          Schedule
        </Button>
      </div>
    </div>
  );
};
