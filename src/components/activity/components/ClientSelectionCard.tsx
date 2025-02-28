
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClientSelector } from "../form/ClientSelector";
import { Client } from "../types";

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
        <ClientSelector 
          selectedClient={selectedClient}
          onClientSelect={onClientSelect}
        />
      </CardContent>
    </Card>
  );
};
