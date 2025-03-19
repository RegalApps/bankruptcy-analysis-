
import { FileText } from "lucide-react";

export const EmptyDocumentState: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center p-6 text-center">
      <div>
        <FileText className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-medium mb-2">No Document Selected</h3>
        <p className="text-muted-foreground">
          Select a document from the list to preview details and collaborate.
        </p>
      </div>
    </div>
  );
};
