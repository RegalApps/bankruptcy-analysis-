
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ClientTabProps {
  clientId: string;
  onBack: () => void;
  onDocumentOpen?: (documentId: string) => void;
}

export const ClientTab = ({ 
  clientId, 
  onBack,
  onDocumentOpen 
}: ClientTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="h-8 px-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-lg font-semibold">Client Details</h2>
      </div>

      <div className="p-6 border rounded-lg">
        <h3 className="text-xl font-medium mb-4">Client ID: {clientId}</h3>
        <p className="text-muted-foreground mb-6">
          Loading client information...
        </p>
        
        <div className="space-y-4">
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[100px] w-full" />
        </div>
      </div>
    </div>
  );
};
