
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, FolderOpen } from "lucide-react";
import { NewClientIntakeDialog } from "../activity/form/NewClientIntakeDialog";

export const DocumentManagement = () => {
  const [showIntakeDialog, setShowIntakeDialog] = useState(false);
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Document Management</CardTitle>
          <Button onClick={() => setShowIntakeDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Client
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="documents" className="space-y-4">
            <TabsList>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="clients">Client Folders</TabsTrigger>
            </TabsList>
            
            <TabsContent value="documents">
              <div className="rounded-md border p-8 text-center space-y-4">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="font-medium">No documents yet</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Start by adding a new client to create folders and upload documents.
                  </p>
                </div>
                <Button variant="outline" onClick={() => setShowIntakeDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Client
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="clients">
              <div className="rounded-md border p-8 text-center space-y-4">
                <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="font-medium">No client folders</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add a new client to automatically create organized folder structures.
                  </p>
                </div>
                <Button variant="outline" onClick={() => setShowIntakeDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Client
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <NewClientIntakeDialog 
        open={showIntakeDialog}
        onOpenChange={setShowIntakeDialog}
        setIsCreatingClient={setIsCreatingClient}
      />
    </div>
  );
};
