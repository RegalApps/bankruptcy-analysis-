
import { ReactNode } from "react";

interface DocumentsPageProviderProps {
  children?: ReactNode;
}

const DocumentsPageProvider = ({ children }: DocumentsPageProviderProps) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Documents</h1>
      {children || (
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-card border rounded-lg">
            <p className="text-muted-foreground">
              Select a document category from the navigation to get started.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPageProvider;
