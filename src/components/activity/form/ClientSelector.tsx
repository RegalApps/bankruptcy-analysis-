
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Client } from "../types";
import { UserCircle, Clock } from "lucide-react";

interface ClientSelectorProps {
  selectedClient: Client | null;
  onClientSelect: (clientId: string) => void;
}

const mockClients: Client[] = [
  { id: "1", name: "John Doe", status: "active", last_activity: "2024-03-10" },
  { id: "2", name: "Reginald Dickerson", status: "active", last_activity: "2024-05-28" },
];

export const ClientSelector = ({ selectedClient, onClientSelect }: ClientSelectorProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Client Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block">
            Select Client
          </label>
          <Select onValueChange={onClientSelect} value={selectedClient?.id}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a client..." />
            </SelectTrigger>
            <SelectContent>
              {mockClients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedClient && (
          <div className="bg-muted p-4 rounded-md space-y-2">
            <div className="flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-primary" />
              <span className="font-medium">{selectedClient.name}</span>
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                selectedClient.status === 'active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {selectedClient.status}
              </span>
            </div>
            {selectedClient.last_activity && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Last activity: {selectedClient.last_activity}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
