
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClientSelector } from "../form/ClientSelector";
import { Client } from "../types";
import { CreateFormButton } from "./CreateFormButton";

interface ClientSelectionCardProps {
  selectedClient: Client | null;
  onClientSelect: (clientId: string) => void;
}

export const ClientSelectionCard = ({ selectedClient, onClientSelect }: ClientSelectionCardProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Financial Dashboard</CardTitle>
        <CardDescription>Select a client to view their financial data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
          <div className="w-full md:w-3/4">
            <ClientSelector 
              selectedClient={selectedClient}
              onClientSelect={onClientSelect}
            />
          </div>
          {selectedClient && (
            <div className="w-full md:w-auto mt-2 md:mt-0">
              <CreateFormButton clientId={selectedClient.id} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
