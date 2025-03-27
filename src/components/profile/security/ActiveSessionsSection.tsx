
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut } from "lucide-react";

export const ActiveSessionsSection = () => {
  return (
    <div className="border-t pt-4 mt-2">
      <div className="space-y-2">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <LogOut className="h-4 w-4 text-muted-foreground" />
          Active Sessions
        </h3>
        <div className="rounded-md border p-3 text-sm">
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="font-medium">Current Session</p>
              <p className="text-xs text-muted-foreground">
                Chrome on Windows • IP: 192.168.1.1
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Mobile App</p>
              <p className="text-xs text-muted-foreground">
                iPhone 13 • Last active: 2 hours ago
              </p>
            </div>
            <Button variant="ghost" size="sm" className="h-7">Sign Out</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
