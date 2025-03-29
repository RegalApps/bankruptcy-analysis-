
import React from "react";
import { Client } from "../../types";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

interface ContactInformationProps {
  client: Client;
}

export const ContactInformation: React.FC<ContactInformationProps> = ({ client }) => {
  return (
    <Card className="p-2 mb-2">
      <h3 className="text-sm font-medium mb-1 px-1">Contact Info</h3>
      <div className="grid grid-cols-2 gap-1 text-sm">
        <div className="flex items-center p-1">
          <Mail className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
          <span className="truncate">{client.email}</span>
        </div>
        <div className="flex items-center p-1">
          <Phone className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
          <span className="truncate">{client.phone}</span>
        </div>
        <div className="flex items-start p-1 col-span-2">
          <MapPin className="h-3.5 w-3.5 mr-1.5 text-muted-foreground mt-0.5" />
          <span className="truncate">{client.address}, {client.city}, {client.province} {client.postalCode}</span>
        </div>
      </div>
    </Card>
  );
};
