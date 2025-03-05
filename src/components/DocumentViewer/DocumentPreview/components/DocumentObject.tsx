
import React from "react";

interface DocumentObjectProps {
  publicUrl: string;
  onError: () => void;
}

export const DocumentObject: React.FC<DocumentObjectProps> = ({ 
  publicUrl, 
  onError 
}) => {
  return (
    <div className="aspect-[3/4] w-full bg-muted rounded-lg overflow-hidden">
      <object
        data={publicUrl}
        type="application/pdf"
        className="w-full h-full rounded-lg"
        onError={onError}
      >
        <p className="p-4 text-center">
          Unable to display PDF. <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">Download</a> instead.
        </p>
      </object>
    </div>
  );
};
