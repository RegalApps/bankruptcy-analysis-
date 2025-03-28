
import { AlertCircle } from "lucide-react";
import { Document } from "@/components/DocumentList/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Form47AlertProps {
  form47Documents: Document[];
}

export const Form47Alert = ({ form47Documents }: Form47AlertProps) => {
  if (form47Documents.length === 0) return null;
  
  return (
    <Alert className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Consumer Proposal Documents</AlertTitle>
      <AlertDescription>
        {form47Documents.length === 1 
          ? "Found a Consumer Proposal document that requires your attention." 
          : `Found ${form47Documents.length} Consumer Proposal documents that require your attention.`}
      </AlertDescription>
    </Alert>
  );
};
