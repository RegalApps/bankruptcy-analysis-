
import React from "react";
import { DocumentViewerFrameProps } from "../types";

export const DocumentViewerFrame: React.FC<DocumentViewerFrameProps> = ({
  children,
  controls
}) => {
  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-card">
      {controls && (
        <div className="border-b p-2 flex items-center justify-between bg-muted/10">
          {controls}
        </div>
      )}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
};
