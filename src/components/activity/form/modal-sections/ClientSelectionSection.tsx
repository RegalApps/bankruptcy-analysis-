
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ClientSelector } from "../ClientSelector";
import { Client } from "../../types";

interface ClientSelectionSectionProps {
  selectedClient: Client | null;
  onClientSelect: (clientId: string) => void;
  enableClientCreation: boolean;
  isCreatingClient: boolean;
  onOpenIntakeDialog: () => void;
  onCreateDirectClient?: () => void; // New prop for direct client creation
}

export const ClientSelectionSection = ({
  selectedClient,
  onClientSelect,
  enableClientCreation,
  isCreatingClient,
  onOpenIntakeDialog,
  onCreateDirectClient
}: ClientSelectionSectionProps) => {
  return (
    <div className="space-y-6">
      <Alert variant="default" className="bg-blue-50 border-blue-200">
        <AlertTriangle className="h-4 w-4 text-blue-500" />
        <AlertDescription>
          Please select a client or create a new one to begin the income and expense form
        </AlertDescription>
      </Alert>
      
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-medium mb-4">🔍 Select or Create Client</h3>
        <div className="flex flex-col md:flex-row items-start gap-4">
          <div className="w-full md:w-3/4">
            <ClientSelector
              selectedClient={selectedClient}
              onClientSelect={onClientSelect}
            />
          </div>
          
          {enableClientCreation && (
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <Button 
                variant="outline" 
                size="sm"
                className="whitespace-nowrap w-full md:w-auto"
                onClick={onOpenIntakeDialog}
                disabled={isCreatingClient}
              >
                {isCreatingClient ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating...
                  </>
                ) : (
                  <>
                    + Add Client With Details
                  </>
                )}
              </Button>
              
              {onCreateDirectClient && (
                <Button 
                  variant="default" 
                  size="sm"
                  className="whitespace-nowrap w-full md:w-auto"
                  onClick={onCreateDirectClient}
                >
                  + Quick Add Client
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
