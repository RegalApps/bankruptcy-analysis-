
import { useState } from "react";
import { toast } from "sonner";
import { Client } from "../types";

interface UseFormSubmissionProps {
  handleSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => Promise<void>;
  selectedClient: Client | null;
}

export const useFormSubmission = ({ handleSubmit, selectedClient }: UseFormSubmissionProps) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Custom submit handler to dispatch custom event
  const onSubmitForm = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    await handleSubmit(e);
    setFormSubmitted(true);
    
    // Dispatch custom event to notify other components
    if (selectedClient) {
      console.log("Form submitted - Dispatching update event");
      const updateEvent = new CustomEvent('financial-data-updated', { 
        detail: { clientId: selectedClient.id } 
      });
      window.dispatchEvent(updateEvent);
    }
    
    // Reset the submitted state after a delay
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  return {
    formSubmitted,
    onSubmitForm
  };
};
