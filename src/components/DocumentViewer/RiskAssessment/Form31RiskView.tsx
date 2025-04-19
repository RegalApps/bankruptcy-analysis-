
import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useFormFieldMapping } from '../hooks/useFormFieldMapping';
import { Risk } from './types';
import { RiskItem } from './RiskItem';

interface Form31RiskViewProps {
  risks: Risk[];
  documentId: string;
  activeRiskId?: string | null;
  onRiskSelect?: (riskId: string | null) => void;
}

export const Form31RiskView: React.FC<Form31RiskViewProps> = ({
  risks,
  documentId,
  activeRiskId,
  onRiskSelect = () => {}
}) => {
  // Sample form data for Form 31 (would be populated from actual document in production)
  const [formData, setFormData] = useState({
    creditorName: "GreenTech Supplies Inc.",
    creditorAddress: "123 Tech Blvd",
    creditorCity: "Toronto", 
    creditorProvince: "Ontario",
    creditorPostalCode: "M5V 2N4",
    debtorName: "ABC Manufacturing Ltd.",
    proceedingType: "bankruptcy",
    claimAmount: "89355.00",
    // Additional fields would be populated from document analysis
  });

  // Use our form field mapping hook
  const {
    mappedFields,
    validationErrors,
    validationWarnings,
    hasErrors,
    hasWarnings
  } = useFormFieldMapping({
    formType: 'form-31',
    documentData: formData
  });

  // Generate risk summary
  const summary = {
    critical: validationErrors.filter(e => e.severity === 'critical').length,
    high: validationErrors.filter(e => e.severity === 'high').length,
    medium: validationWarnings.filter(w => w.severity === 'medium').length,
    low: validationWarnings.filter(w => w.severity === 'low').length
  };

  // Combine our validation issues with any pre-existing risks
  const combinedRisks = [
    ...validationErrors.map((error, index) => ({
      type: `Validation Error: ${error.field}`,
      description: error.message,
      severity: error.severity as 'low' | 'medium' | 'high',
      regulation: error.regulation || 'BIA Regulation',
      id: `validation-error-${index}`
    })),
    ...validationWarnings.map((warning, index) => ({
      type: `Validation Warning: ${warning.field}`,
      description: warning.message,
      severity: warning.severity as 'low' | 'medium' | 'high',
      regulation: warning.regulation || 'BIA Best Practice',
      id: `validation-warning-${index}`
    })),
    ...(risks || []).map((risk, index) => ({
      ...risk,
      id: `risk-${index}`
    }))
  ];

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'high': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'medium': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'low': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default: return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <span className="mr-2">Form 31 - Proof of Claim</span>
          <Badge variant={hasErrors ? "destructive" : hasWarnings ? "default" : "outline"}>
            {hasErrors ? "Issues Found" : hasWarnings ? "Warnings" : "Compliant"}
          </Badge>
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          BIA compliance assessment for Proof of Claim document
        </p>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="p-2 bg-muted/50 rounded-md">
            <p className="text-sm font-medium">Creditor</p>
            <p className="text-xs">{mappedFields.creditorName || "Not specified"}</p>
          </div>
          <div className="p-2 bg-muted/50 rounded-md">
            <p className="text-sm font-medium">Debtor</p>
            <p className="text-xs">{mappedFields.debtorName || "Not specified"}</p>
          </div>
          <div className="p-2 bg-muted/50 rounded-md">
            <p className="text-sm font-medium">Claim Amount</p>
            <p className="text-xs">${mappedFields.claimAmount || "Not specified"}</p>
          </div>
          <div className="p-2 bg-muted/50 rounded-md">
            <p className="text-sm font-medium">Proceeding Type</p>
            <p className="text-xs capitalize">{mappedFields.proceedingType || "Not specified"}</p>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="mb-4">
        <h3 className="text-md font-medium mb-2">Risk Summary</h3>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-1">
              {summary.critical}
            </div>
            <span className="text-xs">Critical</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mb-1">
              {summary.high}
            </div>
            <span className="text-xs">High</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mb-1">
              {summary.medium}
            </div>
            <span className="text-xs">Medium</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-1">
              {summary.low}
            </div>
            <span className="text-xs">Low</span>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      <div>
        <h3 className="text-md font-medium mb-2">Detailed Risk Assessment</h3>
        {combinedRisks.length > 0 ? (
          <ul className="space-y-3">
            {combinedRisks.map((risk) => (
              <li
                key={risk.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  activeRiskId === risk.id ? 'bg-muted/80' : 'hover:bg-muted/50'
                }`}
                onClick={() => onRiskSelect(risk.id)}
              >
                <div className="flex items-center">
                  {getSeverityIcon(risk.severity)}
                  <div className="ml-3">
                    <h4 className="text-sm font-medium">{risk.type}</h4>
                    <p className="text-xs text-muted-foreground">{risk.description}</p>
                    {risk.regulation && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        {risk.regulation}
                      </Badge>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-3 bg-muted/50 rounded-md text-center">
            <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <p className="text-sm">No compliance issues found</p>
          </div>
        )}
      </div>
    </div>
  );
};
