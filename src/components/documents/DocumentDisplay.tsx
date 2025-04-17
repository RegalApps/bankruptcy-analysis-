
import React from 'react';

export const DocumentDisplay = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center bg-muted/30">
      <div className="max-w-md space-y-4">
        <h2 className="text-2xl font-bold">Select a Document</h2>
        <p className="text-muted-foreground">
          Choose a document from the list on the left to view its contents and analysis.
        </p>
      </div>
    </div>
  );
};
