
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Document } from "@/components/DocumentList/types";

interface Form47AlertProps {
  form47Documents: Document[];
}

export const Form47Alert = ({ form47Documents }: Form47AlertProps) => {
  if (form47Documents.length === 0) return null;
  
  return (
    <Alert className="mb-4 bg-primary/10 border-primary/20">
      <AlertCircle className="h-4 w-4 text-primary" />
      <AlertDescription className="text-sm">
        {form47Documents.length} Form 47 document{form47Documents.length > 1 ? 's' : ''} available. 
        Double-click on the document to open it.
      </AlertDescription>
    </Alert>
  );
};
