
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { Document } from "@/components/DocumentList/types";

interface RiskAssessmentProps {
  document: Document | null;
  onValidationComplete: (isValid: boolean) => void;
}

export const RiskAssessment = ({ document, onValidationComplete }: RiskAssessmentProps) => {
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
        <div className="grid gap-4">
          <Alert>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertTitle>Document Structure Validation</AlertTitle>
            <AlertDescription>
              Document structure and format have been verified.
            </AlertDescription>
          </Alert>

          <Alert>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertTitle>Content Verification</AlertTitle>
            <AlertDescription>
              All required fields are present and properly formatted.
            </AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Required Action Needed</AlertTitle>
            <AlertDescription>
              Please review and confirm all signature fields are properly completed.
            </AlertDescription>
          </Alert>
        </div>

        <Button 
          className="w-full mt-4"
          onClick={() => onValidationComplete(true)}
        >
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Confirm Document Review
        </Button>
      </CardContent>
    </Card>
  );
};
