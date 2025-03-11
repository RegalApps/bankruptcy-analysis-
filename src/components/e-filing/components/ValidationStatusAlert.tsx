
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ValidationStatusAlertProps {
  isValid: boolean;
}

export const ValidationStatusAlert = ({ isValid }: ValidationStatusAlertProps) => {
  if (isValid) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <AlertTitle className="text-green-800 font-medium ml-2">Validation Successful</AlertTitle>
        <AlertDescription className="text-green-700 ml-2">
          This document has passed all validation checks and is ready for e-filing.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="bg-red-50 border-red-200">
      <AlertTriangle className="h-5 w-5 text-red-600" />
      <AlertTitle className="text-red-800 font-medium ml-2">Validation Failed</AlertTitle>
      <AlertDescription className="text-red-700 ml-2">
        This document has not passed all required validation checks. Please review the errors.
      </AlertDescription>
    </Alert>
  );
};
