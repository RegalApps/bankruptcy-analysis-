
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentSignaturesPanel } from "./DocumentSignaturesPanel";
import { ClientInfo } from "../../types";

interface ClientDocumentsTabProps {
  client: ClientInfo;
}

export const ClientDocumentsTab = ({ client }: ClientDocumentsTabProps) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="signatures" className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="signatures">Signatures</TabsTrigger>
          <TabsTrigger value="documents">Client Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="signatures" className="mt-4">
          <DocumentSignaturesPanel 
            clientId={client.id}
            clientName={client.name}
            clientEmail={client.email}
          />
        </TabsContent>
        
        <TabsContent value="documents" className="mt-4">
          <div className="p-4 border rounded-md">
            <h3 className="text-lg font-semibold mb-2">Client Documents</h3>
            <p className="text-muted-foreground">
              Documents related to this client will appear here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
