
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { useDocumentValidation } from "./hooks/useDocumentValidation";
import { ValidationResults } from "./components/ValidationResults";
import { RisksList } from "./components/RisksList";
import { SubmitButton } from "./components/SubmitButton";
import { ValidationStatusAlert } from "./components/ValidationStatusAlert";
import { RiskAssessmentProps } from "./types";

export const RiskAssessment = ({ document, onValidationComplete }: RiskAssessmentProps) => {
  const {
    isAnalyzing,
    validations,
    risks,
    overallStatus
  } = useDocumentValidation(document, onValidationComplete);

  if (!document) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          Document Validation & Risk Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Validation Results */}
        <ValidationResults validations={validations} />

        {/* Risk Assessment */}
        <RisksList risks={risks} />

        {/* Action Button */}
        <SubmitButton 
          isAnalyzing={isAnalyzing}
          overallStatus={overallStatus}
          onValidationComplete={onValidationComplete}
        />
      </CardContent>
    </Card>
  );
};
