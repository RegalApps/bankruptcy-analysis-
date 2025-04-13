
import React from "react";

interface ViewerHeaderProps {
  documentTitle: string;
  documentType?: string;
}

export const ViewerHeader: React.FC<ViewerHeaderProps> = ({
  documentTitle,
  documentType = "Document"
}) => {
  return (
    <div className="border-b p-4">
      <h2 className="text-xl font-semibold">{documentTitle}</h2>
      {documentType && <p className="text-sm text-muted-foreground">{documentType}</p>}
    </div>
  );
};
