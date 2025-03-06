
import React from "react";

export const ViewerNotFoundState: React.FC = () => {
  return (
    <div className="py-12 text-center">
      <h3 className="text-lg font-medium">Document Not Found</h3>
      <p className="text-muted-foreground mt-2">
        The requested document could not be found or has been deleted.
      </p>
    </div>
  );
};
