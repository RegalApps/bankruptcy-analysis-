
import { Button } from "@/components/ui/button";
import { useEFiling } from "./context/EFilingContext";
import { AlertCircle, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const DocumentDetails = () => {
  const { selectedDocument, initiateEFiling, isProcessing } = useEFiling();

  if (!selectedDocument) {
    return (
      <div className="text-center text-muted-foreground">
        Select a document to view details
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="font-medium">{selectedDocument.title}</h3>
        <p className="text-sm text-muted-foreground">
          Status: {selectedDocument.status}
        </p>
      </div>

      {selectedDocument.validationErrors && selectedDocument.validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside">
              {selectedDocument.validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Button
        className="w-full"
        disabled={selectedDocument.status !== 'ready' || isProcessing}
        onClick={() => initiateEFiling(selectedDocument.id)}
      >
        {isProcessing ? (
          <>Processing...</>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            E-File Document
          </>
        )}
      </Button>
    </div>
  );
};
