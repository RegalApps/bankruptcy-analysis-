
import { Button } from "@/components/ui/button";
import { Bell, Users, ArrowRight, Plus } from "lucide-react";

interface CRMHeaderProps {
  openClientDialog: () => void;
}

export const CRMHeader = ({ openClientDialog }: CRMHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold">Client Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage your clients and automate workflows
        </p>
      </div>
      <div className="flex gap-4">
        <Button variant="outline" className="gap-2">
          <Bell className="h-4 w-4" />
          Notifications
        </Button>
        <Button 
          variant="default" 
          className="gap-2 bg-primary hover:bg-primary/90" 
          onClick={openClientDialog} 
          size="lg"
        >
          <Plus className="h-5 w-5" />
          Add New Client
        </Button>
      </div>
    </div>
  );
};
