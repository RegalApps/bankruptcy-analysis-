
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { UserPlus, ShieldCheck, Shield, FileCheck, Clock, History } from "lucide-react";
import { RoleManagement } from "./access-control/RoleManagement";
import { ProvinceMappings } from "./access-control/ProvinceMappings";
import { AccessRequests } from "./access-control/AccessRequests";
import { AuditLogs } from "./access-control/AuditLogs";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { AddUserDialog } from "./access-control/AddUserDialog";

export const AccessControlSettings = () => {
  const [activeTab, setActiveTab] = useState("roles");
  const { toast } = useToast();
  const [pendingRequests, setPendingRequests] = useState(3);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  const handleAddUser = (userData: any) => {
    // Add the new user to the users state
    setUsers(prev => [...prev, userData]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Access Control</h2>
          <p className="text-muted-foreground">
            Manage user roles, permissions, and document access
          </p>
        </div>
        <Button onClick={() => setIsAddUserDialogOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add New User
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full md:w-fit">
          <TabsTrigger value="roles" className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" />
            <span>User Roles</span>
          </TabsTrigger>
          <TabsTrigger value="provinces" className="flex items-center gap-1.5">
            <Shield className="h-4 w-4" />
            <span>Province Access</span>
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-1.5 relative">
            <FileCheck className="h-4 w-4" />
            <span>Access Requests</span>
            {pendingRequests > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                {pendingRequests}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-1.5">
            <History className="h-4 w-4" />
            <span>Audit Logs</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Role-Based Access Control</CardTitle>
              <CardDescription>
                Manage user roles and permissions across the organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RoleManagement newUsers={users} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="provinces" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Province Access Mappings</CardTitle>
              <CardDescription>
                Configure which users have access to specific provinces
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProvinceMappings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Access Requests</CardTitle>
              <CardDescription>
                Review and approve access requests from trustees and administrators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AccessRequests 
                pendingRequests={pendingRequests}
                onApproveRequest={() => {
                  setPendingRequests(prev => Math.max(0, prev - 1));
                  toast({
                    title: "Request approved",
                    description: "The user has been granted access to the requested provinces",
                  });
                }}
                onDenyRequest={() => {
                  setPendingRequests(prev => Math.max(0, prev - 1));
                  toast({
                    title: "Request denied",
                    description: "The access request has been denied",
                  });
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>
                Review security and access logs across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AuditLogs />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddUserDialog 
        open={isAddUserDialogOpen}
        onOpenChange={setIsAddUserDialogOpen}
        onUserAdded={handleAddUser}
      />
    </div>
  );
};
