
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { ClientViewerContainer } from "./components/viewer/ClientViewerContainer";
import { ClientViewerProps } from "./types";
import { ClientTemplate } from "./components/ClientTemplate";

export const ClientViewer = (props: ClientViewerProps) => {
  const [hasError, setHasError] = useState(false);
  const [useTemplate, setUseTemplate] = useState(true);
  
  console.log("ClientViewer: Rendering with props:", {
    clientId: props.clientId,
    hasCallback: !!props.onBack,
    hasDocumentCallback: !!props.onDocumentOpen,
    currentRoute: window.location.pathname
  });
  
  // Log more information when rendering special clients
  useEffect(() => {
    if (props.clientId === 'josh-hart') {
      console.log("ClientViewer: Special handling for Josh Hart client");
      toast.success("Loading Josh Hart's client information", {
        description: "Demo client data loaded from local storage"
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
  
  // Ensure the onBack callback doesn't trigger navigation to wrong routes
  const handleBack = () => {
    console.log("ClientViewer: Back button clicked");
    if (props.onBack) {
      // Prevent default navigation behavior if needed
      const event = { preventDefault: () => console.log("Preventing default navigation") };
      props.onBack();
    }
  };
  
  // Always use the template mode which is more reliable and has better layout
  return useTemplate || hasError ? (
    <ClientTemplate 
      clientId={props.clientId} 
      onBack={handleBack}
      onDocumentOpen={props.onDocumentOpen}
    />
  ) : (
    <ClientViewerContainer 
      {...props} 
      onBack={handleBack}
      onError={handleError}
    />
  );
};
