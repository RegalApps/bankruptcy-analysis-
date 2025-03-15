
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface FormAlertsProps {
  formSubmitted: boolean;
}

export const FormAlerts = ({ formSubmitted }: FormAlertsProps) => {
  return (
    <>
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Financial data is synced in real-time. After submitting, the dashboard and predictive analysis will update automatically.
        </AlertDescription>
      </Alert>
      
      {formSubmitted && (
        <Alert className="bg-green-50 border-green-200">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Data submitted successfully! Other tabs will update automatically.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
