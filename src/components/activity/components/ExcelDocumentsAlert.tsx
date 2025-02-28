
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileSpreadsheet } from "lucide-react";

interface ExcelDocumentsAlertProps {
  documents: any[];
  clientName: string;
}

export const ExcelDocumentsAlert = ({ documents, clientName }: ExcelDocumentsAlertProps) => {
  if (!documents || documents.length === 0) return null;

  return (
    <Alert className="bg-green-50 border-green-200">
      <FileSpreadsheet className="h-5 w-5 text-green-600" />
      <AlertDescription className="flex justify-between items-center">
        <span>
          Found {documents.length} Excel document{documents.length !== 1 ? 's' : ''} with financial data for {clientName}.
        </span>
      </AlertDescription>
    </Alert>
  );
};
