
import { useState } from "react";
import { Client } from "../../types";
import { NewClientIntakeDialog } from "../NewClientIntakeDialog";
import { toast } from "sonner";

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

  return {
    showIntakeDialog,
    setShowIntakeDialog,
    isCreatingClient,
    setIsCreatingClient,
    handleClientCreated,
    handleClientSelect
  };
};

export const ClientCreationDialogWrapper = ({ 
  onClientCreated,
  setIsCreatingClient,
  isCreatingClient
}: ClientCreationHandlerProps) => {
  const [showIntakeDialog, setShowIntakeDialog] = useState(false);

  // This component should pass the showIntakeDialog state to the dialog
  return (
    <NewClientIntakeDialog
      open={showIntakeDialog}
      onOpenChange={setShowIntakeDialog}
      onClientCreated={onClientCreated}
      setIsCreatingClient={setIsCreatingClient}
    />
  );
};
