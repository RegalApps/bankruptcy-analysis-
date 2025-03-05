
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

interface ValidationStatusAlertProps {
  isValid: boolean;
}

export const ValidationStatusAlert = ({ isValid }: ValidationStatusAlertProps) => {
  if (!isValid) return null;
  
  return (
    <Alert>
      <CheckCircle2 className="h-4 w-4 text-green-500" />
      <AlertTitle>Ready to E-File</AlertTitle>
      <AlertDescription>
        Document has passed all validation checks and is ready to be filed.
        Click the E-File button above to proceed with filing.
      </AlertDescription>
    </Alert>
  );
};
