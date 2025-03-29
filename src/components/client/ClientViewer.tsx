
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { ClientViewerContainer } from "./components/viewer/ClientViewerContainer";
import { ClientViewerProps } from "./types";
import { ClientTemplate } from "./components/ClientTemplate";
import { getClientData } from "./data/clientTemplates";

export const ClientViewer = (props: ClientViewerProps) => {
  const [hasError, setHasError] = useState(false);
  const [useTemplate, setUseTemplate] = useState(true);
  
  console.log("ClientViewer: Rendering with props:", {
    clientId: props.clientId,
    hasCallback: !!props.onBack,
    hasDocumentCallback: !!props.onDocumentOpen,
    currentRoute: window.location.pathname
  });
  
  // Load client data and show appropriate toast
  useEffect(() => {
    try {
      const clientData = getClientData(props.clientId);
      console.log(`ClientViewer: Loading data for ${clientData.name}`);
      
      toast.success(`Loading ${clientData.name}'s client information`, {
        description: `Client profile loaded successfully`
      });
    } catch (error) {
      console.error("ClientViewer: Error loading client data:", error);
      setHasError(true);
      
      toast.error("Had trouble loading client data", {
        description: "Using simplified view instead"
      });
    }
  }, [props.clientId]);

  // Handle errors in the client viewer
  const handleError = () => {
    console.log("ClientViewer: Error detected, switching to template mode");
    setHasError(true);
    setUseTemplate(true);
    toast.error("Had trouble loading client data", {
      description: "Using simplified view instead"
    });
  };
  
  // Always use the template mode which is more reliable and has better layout
  return useTemplate || hasError ? (
    <ClientTemplate 
      clientId={props.clientId} 
      onBack={props.onBack}
      onDocumentOpen={props.onDocumentOpen}
    />
  ) : (
    <ClientViewerContainer 
      {...props} 
      onError={handleError}
    />
  );
};
