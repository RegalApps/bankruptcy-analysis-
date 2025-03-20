
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Client } from "../types";

interface ClientSelectorProps {
  selectedClient: Client | null;
  onClientSelect: (clientId: string) => void;
  availableClients?: Client[];
}

export const ClientSelector = ({ selectedClient, onClientSelect, availableClients }: ClientSelectorProps) => {
  // Default available clients if none provided
  const clients = availableClients || [
    {
      id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      name: "John Doe",
      status: "active",
      last_activity: "2024-03-15",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Reginald Dickerson",
      status: "active",
      last_activity: "2024-03-12",
    },
  ];

  return (
    <div className="w-full">
      <Select
        value={selectedClient?.id}
        onValueChange={onClientSelect}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a client" />
        </SelectTrigger>
        <SelectContent>
          {clients.map((client) => (
            <SelectItem key={client.id} value={client.id}>
              {client.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
