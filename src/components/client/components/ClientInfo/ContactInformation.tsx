
import React from "react";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin, Building2, Briefcase, Smartphone } from "lucide-react";
import { Client } from "../../types";

interface ContactInformationProps {
  client: Client;
}

export const ContactInformation: React.FC<ContactInformationProps> = ({ client }) => {
  return (
    <Card className="p-3 mb-4 overflow-auto">
      <h3 className="text-sm font-medium mb-2">Contact Information</h3>
      <div className="space-y-2">
        {client.email && (
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">{client.email}</span>
          </div>
        )}
        {client.phone && (
          <div className="flex items-center text-sm">
            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">{client.phone}</span>
          </div>
        )}
        {client.mobilePhone && (
          <div className="flex items-center text-sm">
            <Smartphone className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">{client.mobilePhone}</span>
          </div>
        )}
        {client.address && (
          <div className="flex items-start text-sm">
            <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
            <div className="text-muted-foreground">
              <div>{client.address}</div>
              {client.city && client.province && client.postalCode && (
                <div>{client.city}, {client.province} {client.postalCode}</div>
              )}
            </div>
          </div>
        )}
        {client.company && (
          <div className="flex items-center text-sm">
            <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">{client.company}</span>
          </div>
        )}
        {client.occupation && (
          <div className="flex items-center text-sm">
            <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">{client.occupation}</span>
          </div>
        )}
      </div>
    </Card>
  );
};
