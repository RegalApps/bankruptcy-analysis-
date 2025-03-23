
import { ClientViewerContainer } from "./components/viewer/ClientViewerContainer";
import { ClientViewerProps } from "./types";

export const ClientViewer = (props: ClientViewerProps) => {
  return <ClientViewerContainer {...props} />;
};
