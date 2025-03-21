
import { useState, useCallback } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

// Client creation hook
export const useClientCreation = (
  onClientCreated: (clientId: string) => void,
  hasUnsavedChanges: boolean,
) => {
  const [showIntakeDialog, setShowIntakeDialog] = useState(false);
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] = useState(false);
  const [pendingClientId, setPendingClientId] = useState<string | null>(null);
  
  // Handle client created by intake form
  const handleClientCreated = useCallback((clientId: string) => {
    onClientCreated(clientId);
  }, [onClientCreated]);
  
  // Handle client select from dropdown or creation
  const handleClientSelect = useCallback((clientId: string) => {
    if (hasUnsavedChanges) {
      setPendingClientId(clientId);
      setShowUnsavedChangesDialog(true);
    } else {
      onClientCreated(clientId);
    }
  }, [hasUnsavedChanges, onClientCreated]);
  
  // When the user confirms they want to discard changes
  const handleConfirmClientChange = useCallback(() => {
    if (pendingClientId) {
      onClientCreated(pendingClientId);
      setPendingClientId(null);
    }
    setShowUnsavedChangesDialog(false);
  }, [pendingClientId, onClientCreated]);
  
  return {
    showIntakeDialog,
    setShowIntakeDialog,
    isCreatingClient,
    setIsCreatingClient,
    showUnsavedChangesDialog,
    setShowUnsavedChangesDialog,
    handleClientCreated,
    handleClientSelect,
    handleConfirmClientChange
  };
};

// Wrapper for the unsaved changes dialog
export const ClientCreationDialogWrapper = ({
  showUnsavedChangesDialog,
  setShowUnsavedChangesDialog,
  handleConfirmClientChange
}: {
  showUnsavedChangesDialog: boolean;
  setShowUnsavedChangesDialog: (show: boolean) => void;
  handleConfirmClientChange: () => void;
}) => {
  return (
    <AlertDialog open={showUnsavedChangesDialog} onOpenChange={setShowUnsavedChangesDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes. Are you sure you want to switch clients? 
            Your current changes will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => setShowUnsavedChangesDialog(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirmClientChange}>
            Discard Changes
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
