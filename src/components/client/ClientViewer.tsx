
import { ClientViewerContainer } from "./components/viewer/ClientViewerContainer";
import { ClientViewerProps } from "./types";

export const ClientViewer = (props: ClientViewerProps) => {
  console.log("ClientViewer: Rendering with props:", {
    clientId: props.clientId,
    hasCallback: !!props.onBack,
    hasDocumentCallback: !!props.onDocumentOpen 
  });
  
  return <ClientViewerContainer {...props} />;
};
