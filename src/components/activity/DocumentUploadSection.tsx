
import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Folder } from "lucide-react";
import { toast } from "sonner";

export const DocumentUploadSection = () => {
  const [newClientName, setNewClientName] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // Fetch existing clients
  const { data: clients, refetch: refetchClients } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("id, title")
        .eq("is_folder", true)
        .eq("folder_type", "client");

      if (error) throw error;
      return data || [];
    },
  });

  // Create a new client folder
  const handleCreateClient = async () => {
    if (!newClientName.trim()) {
      toast.error("Please enter a client name");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("documents")
        .insert({
          title: newClientName.trim(),
          is_folder: true,
          folder_type: "client",
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Client folder created successfully");
      setNewClientName("");
      refetchClients();
      setSelectedClientId(data.id);
    } catch (error) {
      toast.error("Failed to create client folder");
      console.error("Error creating client folder:", error);
    }
  };

  const handleUploadComplete = async (documentId: string) => {
    if (selectedClientId) {
      try {
        const { error } = await supabase
          .from("documents")
          .update({ parent_folder_id: selectedClientId })
          .eq("id", documentId);

        if (error) throw error;
        toast.success("Document uploaded and linked to client successfully");
      } catch (error) {
        console.error("Error linking document to client:", error);
        toast.error("Failed to link document to client");
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supporting Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={selectedClientId || "new"} className="space-y-4">
          <TabsList>
            <TabsTrigger value="new">New Client</TabsTrigger>
            {clients?.map((client) => (
              <TabsTrigger
                key={client.id}
                value={client.id}
                onClick={() => setSelectedClientId(client.id)}
              >
                {client.title}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="new" className="space-y-4">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="clientName">New Client Name</Label>
                <div className="flex gap-2">
                  <Input
                    id="clientName"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="Enter client name"
                  />
                  <Button onClick={handleCreateClient}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {clients?.map((client) => (
            <TabsContent key={client.id} value={client.id} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Folder className="h-5 w-5" />
                <span className="font-medium">{client.title}</span>
              </div>
              <FileUpload onUploadComplete={handleUploadComplete} />
            </div>
          ))}
        </TabsContent>
      </CardContent>
    </Card>
  );
};
