
import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, XCircle, CalendarIcon, DollarSign, FileCheck, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useFormFieldMapping } from '../hooks/useFormFieldMapping';
import { Risk } from './types';

export interface Form47RiskViewProps {
  risks: Risk[];
  documentId: string;
  activeRiskId?: string | null;
  onRiskSelect?: (riskId: string | null) => void;
}

export const Form47RiskView: React.FC<Form47RiskViewProps> = ({ 
  risks, 
  documentId,
  activeRiskId,
  onRiskSelect = () => {}
}) => {
  // Sample form data for Form 47 (would be populated from actual document in production)
  const [formData, setFormData] = useState({
    consumerDebtorName: "Josh Hart",
    consumerDebtorAddress: "456 Maple Ave",
    consumerDebtorCity: "Vancouver",
    consumerDebtorProvince: "British Columbia",
    consumerDebtorPostalCode: "V6B 2Z4",
    administratorName: "Tom Francis",
    administratorLicense: "LIT-12345",
    unsecuredPayment: "15000.00",
    paymentStartDate: "2025-04-01",
    paymentEndDate: "2028-04-01", // Note: This is over 3 years which is valid
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
    formType: 'form-47',
    documentData: formData
  });

  // Filter for Form 47 specific categories
  const paymentRisks = risks.filter(r => 
    r.type.toLowerCase().includes('payment') || 
    r.description.toLowerCase().includes('payment')
  );
  
  const complianceRisks = risks.filter(r => 
    r.type.toLowerCase().includes('compliance') || 
    r.description.toLowerCase().includes('compliance')
  );
  
  const documentationRisks = risks.filter(r => 
    r.type.toLowerCase().includes('missing') || 
    r.description.toLowerCase().includes('missing') ||
    r.type.toLowerCase().includes('document')
  );
  
  const timelineRisks = risks.filter(r => 
    r.type.toLowerCase().includes('deadline') || 
    r.description.toLowerCase().includes('deadline') || 
    r.type.toLowerCase().includes('time')
  );
  
  const otherRisks = risks.filter(r => 
    !paymentRisks.includes(r) && 
    !complianceRisks.includes(r) && 
    !documentationRisks.includes(r) && 
    !timelineRisks.includes(r)
  );

  // Generate risk summary from validation results
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

  const getCategoryRisks = (category: string) => {
    switch (category) {
      case 'payment': return paymentRisks;
      case 'compliance': return complianceRisks;
      case 'documentation': return documentationRisks;
      case 'timeline': return timelineRisks;
      default: return otherRisks;
    }
  };

  const renderRiskCategory = (category: string, icon: React.ReactNode, title: string) => {
    const categoryRisks = getCategoryRisks(category);
    if (!categoryRisks.length) return null;

    return (
      <div className="mb-4">
        <div className="flex items-center mb-2">
          {icon}
          <h3 className="text-md font-medium ml-2">{title}</h3>
        </div>
        <ul className="space-y-2">
          {categoryRisks.map((risk, index) => (
            <li
              key={`${category}-${index}`}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                activeRiskId === `${category}-${index}` ? 'bg-muted/80' : 'hover:bg-muted/50'
              }`}
              onClick={() => onRiskSelect(`${category}-${index}`)}
            >
              <div className="flex">
                {getSeverityIcon(risk.severity)}
                <div className="ml-2">
                  <span className="text-sm font-medium">{risk.type}</span>
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
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <span className="mr-2">Form 47 - Consumer Proposal</span>
          <Badge variant={hasErrors ? "destructive" : hasWarnings ? "default" : "outline"}>
            {hasErrors ? "Issues Found" : hasWarnings ? "Warnings" : "Compliant"}
          </Badge>
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          BIA compliance assessment for Consumer Proposal document
        </p>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="p-2 bg-muted/50 rounded-md">
            <p className="text-sm font-medium">Consumer Debtor</p>
            <p className="text-xs">{mappedFields.consumerDebtorName || "Not specified"}</p>
          </div>
          <div className="p-2 bg-muted/50 rounded-md">
            <p className="text-sm font-medium">Administrator</p>
            <p className="text-xs">{mappedFields.administratorName || "Not specified"}</p>
          </div>
          <div className="p-2 bg-muted/50 rounded-md">
            <p className="text-sm font-medium">Payment Schedule</p>
            <p className="text-xs">{mappedFields.paymentStartDate ? `Starts: ${mappedFields.paymentStartDate}` : "Not specified"}</p>
          </div>
          <div className="p-2 bg-muted/50 rounded-md">
            <p className="text-sm font-medium">Payment Total</p>
            <p className="text-xs">${mappedFields.unsecuredPayment || "Not specified"}</p>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="mb-4">
        <h3 className="text-md font-medium mb-2">Risk Summary</h3>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-1">
              {summary.critical + summary.high}
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
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-1">
              {combinedRisks.length}
            </div>
            <span className="text-xs">Total</span>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {combinedRisks.length > 0 ? (
        <div className="space-y-4">
          {renderRiskCategory('payment', <DollarSign className="h-5 w-5 text-blue-500" />, 'Payment Terms')}
          {renderRiskCategory('compliance', <FileCheck className="h-5 w-5 text-green-500" />, 'Compliance Issues')}
          {renderRiskCategory('documentation', <AlertTriangle className="h-5 w-5 text-amber-500" />, 'Documentation Risks')}
          {renderRiskCategory('timeline', <Clock className="h-5 w-5 text-purple-500" />, 'Timeline Concerns')}
          {renderRiskCategory('other', <AlertCircle className="h-5 w-5 text-red-500" />, 'Other Issues')}
          
          <div className="p-3 border border-amber-200 bg-amber-50 rounded-md mt-4">
            <p className="text-sm text-amber-800">
              <span className="font-medium">Note:</span> All risks must be addressed before submission to meet BIA requirements.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-muted/50 rounded-md text-center">
          <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto mb-2" />
          <p className="text-sm">No compliance issues found</p>
          <p className="text-xs text-muted-foreground mt-1">
            This consumer proposal meets all BIA requirements and is ready for submission.
          </p>
        </div>
      )}
    </div>
  );
};
