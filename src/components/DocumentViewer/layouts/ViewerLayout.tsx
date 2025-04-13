
import React from "react";
import { ViewerHeader } from "./components/ViewerHeader";

interface ViewerLayoutProps {
  documentId: string;
  children: React.ReactNode;
  documentTitle?: string;
}

export const ViewerLayout: React.FC<ViewerLayoutProps> = ({
  documentId,
  children,
  documentTitle = "Document",
}) => {
  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-background">
      <ViewerHeader
        documentTitle={documentTitle}
        documentType="Document"
      />
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
};
