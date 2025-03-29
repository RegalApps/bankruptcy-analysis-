
import React, { useEffect } from "react";
import { toast } from "sonner";
import { ClientViewerContainer } from "./components/viewer/ClientViewerContainer";
import { ClientViewerProps } from "./types";

export const ClientViewer = (props: ClientViewerProps) => {
  console.log("ClientViewer: Rendering with props:", {
    clientId: props.clientId,
    hasCallback: !!props.onBack,
    hasDocumentCallback: !!props.onDocumentOpen 
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
  
  return <ClientViewerContainer {...props} />;
};
