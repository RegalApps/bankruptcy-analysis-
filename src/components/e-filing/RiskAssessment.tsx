
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, ShieldCheck, XCircle } from "lucide-react";
import { Document } from "@/components/DocumentList/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface RiskAssessmentProps {
  document: Document | null;
  onValidationComplete: (isValid: boolean) => void;
}

interface ValidationResult {
  id: string;
  title: string;
  status: 'success' | 'warning' | 'error';
  description: string;
}

interface RiskItem {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  regulation?: string;
}

export const RiskAssessment = ({ document, onValidationComplete }: RiskAssessmentProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [validations, setValidations] = useState<ValidationResult[]>([]);
  const [risks, setRisks] = useState<RiskItem[]>([]);
  const [overallStatus, setOverallStatus] = useState<'pending' | 'failed' | 'passed'>('pending');

  useEffect(() => {
    if (document) {
      performDocumentAnalysis();
    }
  }, [document]);

  const performDocumentAnalysis = async () => {
    if (!document) return;

    setIsAnalyzing(true);
    try {
      // Call the Supabase Edge Function for document analysis
      const { data, error } = await supabase.functions.invoke('analyze-document', {
        body: {
          documentId: document.id,
          includeRegulatory: true
        }
      });

      if (error) throw error;

      // Process validation results
      const processedValidations: ValidationResult[] = [
        {
          id: 'structure',
          title: 'Document Structure',
          status: data.structureValid ? 'success' : 'error',
          description: data.structureValid 
            ? 'Document structure is valid and follows required format'
            : 'Document structure does not meet requirements'
        },
        {
          id: 'fields',
          title: 'Required Fields',
          status: data.requiredFieldsPresent ? 'success' : 'error',
          description: data.requiredFieldsPresent
            ? 'All required fields are present and properly formatted'
            : 'Missing or improperly formatted required fields'
        },
        {
          id: 'signatures',
          title: 'Signatures',
          status: data.signaturesValid ? 'success' : 'error',
          description: data.signaturesValid
            ? 'All required signatures are present and valid'
            : 'Missing or invalid signatures detected'
        }
      ];

      setValidations(processedValidations);
      setRisks(data.risks || []);
      
      // Determine overall status
      const hasErrors = processedValidations.some(v => v.status === 'error');
      const hasHighRisks = data.risks?.some((r: RiskItem) => r.severity === 'high');
      
      setOverallStatus(hasErrors || hasHighRisks ? 'failed' : 'passed');
      onValidationComplete(!hasErrors && !hasHighRisks);

      if (hasErrors || hasHighRisks) {
        toast.error("Document validation failed. Please review the issues.");
      } else {
        toast.success("Document validation successful!");
      }

    } catch (error: any) {
      console.error('Analysis error:', error);
      toast.error("Failed to analyze document");
      setOverallStatus('failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

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
        <div className="grid gap-4">
          {validations.map((validation) => (
            <Alert key={validation.id} variant={getAlertVariant(validation.status)}>
              {getStatusIcon(validation.status)}
              <AlertTitle>{validation.title}</AlertTitle>
              <AlertDescription>{validation.description}</AlertDescription>
            </Alert>
          ))}
        </div>

        {/* Risk Assessment */}
        {risks.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Risk Assessment</h3>
            <div className="space-y-4">
              {risks.map((risk, index) => (
                <Alert 
                  key={index}
                  variant={risk.severity === 'high' ? 'destructive' : 'default'}
                >
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle className="flex items-center gap-2">
                    {risk.type}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      risk.severity === 'high' 
                        ? 'bg-destructive text-destructive-foreground' 
                        : risk.severity === 'medium'
                        ? 'bg-yellow-500/20 text-yellow-700'
                        : 'bg-green-500/20 text-green-700'
                    }`}>
                      {risk.severity.toUpperCase()}
                    </span>
                  </AlertTitle>
                  <AlertDescription>
                    <p className="mt-2">{risk.description}</p>
                    {risk.regulation && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        Regulation: {risk.regulation}
                      </p>
                    )}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button 
          className="w-full mt-6"
          onClick={() => onValidationComplete(overallStatus === 'passed')}
          disabled={isAnalyzing || overallStatus === 'failed'}
        >
          {isAnalyzing ? (
            <>Analyzing Document...</>
          ) : overallStatus === 'passed' ? (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Confirm Document Review
            </>
          ) : (
            <>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Review Required Issues
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
