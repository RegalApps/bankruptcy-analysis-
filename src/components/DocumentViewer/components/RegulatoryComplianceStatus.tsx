
import React from "react";
import { RegulatoryCompliance } from "@/utils/documents/types/analysisTypes";

interface RegulatoryComplianceStatusProps {
  complianceData: RegulatoryCompliance;
}

export const RegulatoryComplianceStatus: React.FC<RegulatoryComplianceStatusProps> = ({
  complianceData
}) => {
  return (
    <div className="mt-2">
      <h4 className="font-medium mb-1">Compliance Status</h4>
      <div className={`px-3 py-2 rounded-md text-sm ${
        complianceData.status === 'compliant' 
          ? 'bg-green-50 text-green-700 border border-green-200' 
          : complianceData.status === 'non_compliant'
          ? 'bg-red-50 text-red-700 border border-red-200'
          : 'bg-orange-50 text-orange-700 border border-orange-200'
      }`}>
        <p>{complianceData.details}</p>
        {complianceData.references && complianceData.references.length > 0 && (
          <div className="mt-1">
            <p className="font-medium text-xs">References:</p>
            <ul className="list-disc list-inside text-xs">
              {complianceData.references.map((ref, idx) => (
                <li key={idx}>{ref}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
