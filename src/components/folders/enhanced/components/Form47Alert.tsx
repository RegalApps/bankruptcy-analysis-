
import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Document } from "@/components/client/types";

interface Form47AlertProps {
  form47Documents: Document[];
}

export const Form47Alert = ({ form47Documents }: Form47AlertProps) => {
  if (!form47Documents || form47Documents.length === 0) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Important Form 47 Documents</AlertTitle>
      <AlertDescription>
        <p className="mb-2">
          {form47Documents.length} Form 47 document{form47Documents.length !== 1 ? 's' : ''} require{form47Documents.length === 1 ? 's' : ''} immediate attention.
        </p>
        <ul className="list-disc pl-5 text-sm">
          {form47Documents.slice(0, 3).map(doc => (
            <li key={doc.id}>{doc.title || 'Unnamed Form 47'}</li>
          ))}
          {form47Documents.length > 3 && (
            <li>And {form47Documents.length - 3} more...</li>
          )}
        </ul>
      </AlertDescription>
    </Alert>
  );
};
