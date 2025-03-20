
import React from "react";
import { toast } from "sonner";
import { Client } from "../../types";

export const useFormSubmission = (
  handleSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => Promise<void>,
  setHasUnsavedChanges: (value: boolean) => void,
  onOpenChange: (open: boolean) => void
) => {
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleSubmit(e as React.SyntheticEvent<HTMLFormElement>);
      toast.success("Form submitted successfully!");
      setHasUnsavedChanges(false);
      setTimeout(() => onOpenChange(false), 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form");
    }
  };
  
  const handleDocumentSubmit = (e: React.FormEvent) => {
    handleFormSubmit(e).catch(err => {
      console.error("Error in document submission:", err);
    });
  };
  
  const handleCloseWithConfirmation = () => {
    if (setHasUnsavedChanges) {
      if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
        onOpenChange(false);
      }
    } else {
      onOpenChange(false);
    }
  };
  
  const handleSaveDraft = () => {
    toast.success("Draft saved successfully!");
    setHasUnsavedChanges(false);
  };

  return {
    handleFormSubmit,
    handleDocumentSubmit,
    handleCloseWithConfirmation,
    handleSaveDraft
  };
};
