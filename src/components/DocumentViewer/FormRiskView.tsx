
import React from 'react';
import { Form31RiskView } from './RiskAssessment/Form31RiskView';
import { Form47RiskView } from './RiskAssessment/Form47RiskView';
import { Risk } from './RiskAssessment/types';

interface FormRiskViewProps {
  formType?: string;
  documentId: string;
  risks: Risk[];
  activeRiskId?: string | null;
  onRiskSelect?: (riskId: string | null) => void;
}

export const FormRiskView: React.FC<FormRiskViewProps> = ({
  formType,
  documentId,
  risks,
  activeRiskId,
  onRiskSelect
}) => {
  // If formType is provided, use it to determine which risk view to render
  if (formType === 'form-31' || formType === '31' || formType === 'proof-of-claim') {
    return (
      <Form31RiskView
        documentId={documentId}
        risks={risks}
        activeRiskId={activeRiskId}
        onRiskSelect={onRiskSelect}
      />
    );
  }

  if (formType === 'form-47' || formType === '47' || formType === 'consumer-proposal') {
    return (
      <Form47RiskView
        documentId={documentId}
        risks={risks}
        activeRiskId={activeRiskId}
        onRiskSelect={onRiskSelect}
      />
    );
  }

  // Default to standard risk assessment
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Document Risk Assessment</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Risk assessment for this document type is not available. Please use the general risk assessment panel.
      </p>
    </div>
  );
};
