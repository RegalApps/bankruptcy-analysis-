
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { ClientViewerContainer } from "./components/viewer/ClientViewerContainer";
import { ClientViewerProps } from "./types";
import { ClientTemplate } from "./components/ClientTemplate";
import { getClientData } from "./data/clientTemplates";

export const ClientViewer = (props: ClientViewerProps) => {
  const [hasError, setHasError] = useState(false);
  const [useTemplate, setUseTemplate] = useState(true); // Always start with template mode
  
  console.log("ClientViewer: Rendering with props:", {
    clientId: props.clientId,
    hasCallback: !!props.onBack,
    hasDocumentCallback: !!props.onDocumentOpen,
    currentRoute: window.location.pathname
  });
  
  // Special handling for josh-hart client ID
  useEffect(() => {
    if (props.clientId.toLowerCase().includes('josh') || props.clientId.toLowerCase().includes('hart')) {
      const clientId = 'josh-hart'; // Normalize to josh-hart
      console.log(`ClientViewer: Detected Josh Hart client (${clientId})`);
      
      try {
        // Get client data from templates
        const clientData = getClientData(clientId);
        console.log(`ClientViewer: Successfully loaded data for ${clientData.name}`);
        
        toast.success(`Loading ${clientData.name}'s client information`, {
          description: `Client profile loaded successfully`
        });
      } catch (error) {
        console.error("ClientViewer: Error loading Josh Hart data:", error);
        setHasError(true);
        
        toast.error("Had trouble loading client data", {
          description: "Using simplified view instead"
        });
      }
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
  
  // If clientId contains 'josh' or 'hart', normalize it to 'josh-hart'
  const normalizedClientId = props.clientId.toLowerCase().includes('josh') || 
                             props.clientId.toLowerCase().includes('hart') 
                             ? 'josh-hart' 
                             : props.clientId;
  
  // Always use the template mode which is more reliable and has better layout
  return useTemplate || hasError ? (
    <ClientTemplate 
      clientId={normalizedClientId} 
      onBack={props.onBack}
      onDocumentOpen={props.onDocumentOpen}
    />
  ) : (
    <ClientViewerContainer 
      {...props} 
      onError={handleError}
      clientId={normalizedClientId}
    />
  );
};
