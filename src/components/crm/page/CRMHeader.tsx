
import { Button } from "@/components/ui/button";
import { Bell, Users } from "lucide-react";

interface CRMHeaderProps {
  openClientDialog: () => void;
}

export const CRMHeader = ({ openClientDialog }: CRMHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">Client Relationship Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage your clients and automate workflows
        </p>
      </div>
      <div className="flex gap-4">
        <Button variant="outline" className="gap-2">
          <Bell className="h-4 w-4" />
          Notifications
        </Button>
        <Button className="gap-2" onClick={openClientDialog}>
          <Users className="h-4 w-4" />
          Add New Client
        </Button>
      </div>
    </div>
  );
};
