
import { useState } from "react";
import { Client } from "../../types";
import { NewClientIntakeDialog } from "../NewClientIntakeDialog";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

interface ClientCreationHandlerProps {
  onClientCreated: (clientId: string) => void;
  setIsCreatingClient: (isCreating: boolean) => void;
  isCreatingClient: boolean;
}

export const useClientCreation = (
  onClientSelect: (clientId: string) => void,
  hasUnsavedChanges: boolean
) => {
  const [showIntakeDialog, setShowIntakeDialog] = useState(false);
  const [isCreatingClient, setIsCreatingClient] = useState(false);

  const handleClientCreated = (newClientId: string) => {
    setShowIntakeDialog(false);
    handleClientSelect(newClientId);
    toast.success("New client created successfully");
  };

  const handleClientSelect = (clientId: string) => {
    if (hasUnsavedChanges) {
      if (!window.confirm("You have unsaved changes. Are you sure you want to switch clients?")) {
        return;
      }
    }
    
    onClientSelect(clientId);
  };

  const handleDirectClientCreation = () => {
    // Generate a UUID for the new client
    const newClientId = uuidv4();
    
    // Create a temporary client with the new ID
    // Pass the client ID to the parent component
    onClientSelect(newClientId);
    
    toast.success("New client created. Please fill in client details.");
  };

  return {
    showIntakeDialog,
    setShowIntakeDialog,
    isCreatingClient,
    setIsCreatingClient,
    handleClientCreated,
    handleClientSelect,
    handleDirectClientCreation
  };
};

export const ClientCreationDialogWrapper = ({ 
  onClientCreated,
  setIsCreatingClient,
  isCreatingClient
}: ClientCreationHandlerProps) => {
  const [showIntakeDialog, setShowIntakeDialog] = useState(false);

  return (
    <NewClientIntakeDialog
      open={showIntakeDialog}
      onOpenChange={setShowIntakeDialog}
      onClientCreated={onClientCreated}
      setIsCreatingClient={setIsCreatingClient}
    />
  );
};
