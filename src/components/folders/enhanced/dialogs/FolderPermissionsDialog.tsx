
import { useState } from "react";
import { Shield, Users, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types/folders";

interface FolderPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId?: string;
}

export const FolderPermissionsDialog = ({
  open,
  onOpenChange,
  folderId,
}: FolderPermissionsDialogProps) => {
  const [users, setUsers] = useState([
    { id: "1", name: "John Doe", email: "john@example.com", role: "admin" as UserRole },
    { id: "2", name: "Jane Smith", email: "jane@example.com", role: "user" as UserRole },
  ]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Folder Permissions
          </DialogTitle>
          <DialogDescription>
            Manage who can access and modify this folder.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold">Users with access</h3>
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <UserPlus className="h-3.5 w-3.5" />
                <span>Add User</span>
              </Button>
            </div>

            <div className="border rounded-md divide-y">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      className="h-8 rounded-md border border-input bg-background px-3 py-1 text-xs"
                      value={user.role}
                      onChange={(e) => {
                        // Update role logic would go here in a real app
                        console.log("Update role", user.id, e.target.value);
                      }}
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="user">User</option>
                      <option value="reviewer">Reviewer</option>
                      <option value="guest">Guest</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
