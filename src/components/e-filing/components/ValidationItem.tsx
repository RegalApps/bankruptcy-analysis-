
import { AlertDescription, AlertTitle, Alert } from "@/components/ui/alert";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { ValidationResult } from "../types";

interface ValidationItemProps {
  validation: ValidationResult;
}

export const ValidationItem = ({ validation }: ValidationItemProps) => {
  const getAlertVariant = (status: ValidationResult['status']) => {
    switch (status) {
      case 'success': return 'default';
      case 'warning': return 'default';
      case 'error': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: ValidationResult['status']) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-destructive" />;
      default: return null;
    }
  };

  return (
    <Alert variant={getAlertVariant(validation.status)}>
      {getStatusIcon(validation.status)}
      <AlertTitle>{validation.title}</AlertTitle>
      <AlertDescription>{validation.description}</AlertDescription>
    </Alert>
  );
};
