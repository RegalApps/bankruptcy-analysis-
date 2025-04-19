
import React, { useState, useEffect } from 'react';
import { Risk } from '../types';
import { Form47RiskView } from './Form47RiskView';
import { toast } from 'sonner';

interface RiskAssessmentProps {
  documentId: string;
  onRiskSelect?: (riskId: string | null) => void;
  risks?: Risk[];
  activeRiskId?: string | null;
}

const RiskAssessment: React.FC<RiskAssessmentProps> = ({ 
  documentId, 
  onRiskSelect,
  risks: providedRisks,
  activeRiskId
}) => {
  const [localActiveRisk, setLocalActiveRisk] = useState<string | null>(activeRiskId || null);
  const [risks, setRisks] = useState<Risk[]>(providedRisks || []);

  useEffect(() => {
    // Update localActiveRisk when activeRiskId prop changes
    if (activeRiskId !== undefined) {
      setLocalActiveRisk(activeRiskId);
    }
  }, [activeRiskId]);

  useEffect(() => {
    // Update risks when providedRisks changes
    if (providedRisks) {
      setRisks(providedRisks);
      return;
    }

    // Only fetch mock risks if none were provided
    const fetchRisks = async () => {
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock risk data based on documentId
      let mockRisks: Risk[] = [];
      if (documentId === 'sample-document') {
        mockRisks = [
          {
            type: "Data Breach Risk",
            description: "Potential exposure of sensitive customer data.",
            severity: "high",
            regulation: "GDPR",
            solution: "Implement encryption and access controls.",
            deadline: "1 week"
          },
          {
            type: "Compliance Violation",
            description: "Non-compliance with industry regulations.",
            severity: "medium",
            regulation: "HIPAA",
            solution: "Conduct compliance audit and training.",
            deadline: "2 weeks"
          }
        ];
      } else if (documentId === 'financial-report') {
        mockRisks = [
          {
            type: "Financial Misstatement",
            description: "Inaccurate financial reporting.",
            severity: "high",
            regulation: "SOX",
            solution: "Review and correct financial statements.",
            deadline: "1 month"
          },
          {
            type: "Fraud Risk",
            description: "Potential for fraudulent activities.",
            severity: "medium",
            regulation: "FCPA",
            solution: "Implement fraud detection measures.",
            deadline: "2 months"
          }
        ];
      } else if (documentId === 'form47') {
        // Risks will be loaded in Form47RiskView
      } else {
        mockRisks = [
          {
            type: "Generic Risk",
            description: "This is a generic risk for demonstration.",
            severity: "low",
            regulation: "N/A",
            solution: "Review and mitigate as necessary.",
            deadline: "3 months"
          }
        ];
      }

      setRisks(mockRisks);
    };

    fetchRisks();
  }, [documentId, providedRisks]);

  const handleRiskSelect = (riskId: string | null) => {
    setLocalActiveRisk(riskId);
    if (onRiskSelect) {
      onRiskSelect(riskId);
    }
  };

  if (documentId === 'form47') {
    return (
      <Form47RiskView 
        risks={risks} 
        documentId={documentId}
        activeRiskId={localActiveRisk}
        onRiskSelect={handleRiskSelect}
      />
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Risk Assessment</h2>
      {risks.length > 0 ? (
        <ul className="space-y-2">
          {risks.map((risk, index) => (
            <li 
              key={`risk-${index}`}
              className={`p-3 border rounded-md shadow-sm cursor-pointer ${localActiveRisk === `risk-${index}` ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
              onClick={() => {
                const riskId = `risk-${index}`;
                handleRiskSelect(riskId);
                toast.info(`Selected risk: ${risk.type}`, {
                  description: risk.description
                });
              }}
            >
              <h3 className="text-lg font-semibold">{risk.type}</h3>
              <p className="text-sm text-gray-600">{risk.description}</p>
              <div className="mt-2">
                <span className="inline-block bg-red-200 text-red-700 rounded-full px-3 py-1 text-xs font-semibold mr-2">
                  Severity: {risk.severity}
                </span>
                <span className="inline-block bg-purple-200 text-purple-700 rounded-full px-3 py-1 text-xs font-semibold">
                  Regulation: {risk.regulation}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No risks identified for this document.</p>
      )}
    </div>
  );
};

// Export as default and named export to support both import styles
export default RiskAssessment;
export { RiskAssessment };
