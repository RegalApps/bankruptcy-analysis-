
import React from "react";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin, Building2, Briefcase, Smartphone } from "lucide-react";
import { Client } from "../../types";

interface ContactInformationProps {
  client: Client;
}

export const ContactInformation: React.FC<ContactInformationProps> = ({ client }) => {
  return (
    <Card className="p-3 mb-3 overflow-auto">
      <h3 className="text-sm font-medium mb-1">Contact Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
        {client.email && (
          <div className="flex items-center text-sm">
            <Mail className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <span className="text-muted-foreground text-xs">{client.email}</span>
          </div>
        )}
        {client.phone && (
          <div className="flex items-center text-sm">
            <Phone className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <span className="text-muted-foreground text-xs">{client.phone}</span>
          </div>
        )}
        {client.mobilePhone && (
          <div className="flex items-center text-sm">
            <Smartphone className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <span className="text-muted-foreground text-xs">{client.mobilePhone}</span>
          </div>
        )}
        {client.company && (
          <div className="flex items-center text-sm">
            <Building2 className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <span className="text-muted-foreground text-xs">{client.company}</span>
          </div>
        )}
        {client.occupation && (
          <div className="flex items-center text-sm">
            <Briefcase className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <span className="text-muted-foreground text-xs">{client.occupation}</span>
          </div>
        )}
        {client.address && (
          <div className="col-span-1 md:col-span-2 flex items-start text-sm">
            <MapPin className="h-3.5 w-3.5 mr-1.5 mt-0.5 text-muted-foreground flex-shrink-0" />
            <div className="text-muted-foreground text-xs">
              <div>{client.address}</div>
              {client.city && client.province && client.postalCode && (
                <div>{client.city}, {client.province} {client.postalCode}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
