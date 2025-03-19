
import { AlertCircle, AlertTriangle, CheckCircle } from "lucide-react";

interface ComplianceBadgeProps {
  complianceStatus: 'compliant' | 'issues' | 'critical';
}

export const ComplianceBadge = ({ complianceStatus }: ComplianceBadgeProps) => {
  const getComplianceColor = (status: 'compliant' | 'issues' | 'critical') => {
    switch (status) {
      case 'compliant': return 'text-green-500 bg-green-100';
      case 'issues': return 'text-amber-500 bg-amber-100';
      case 'critical': return 'text-red-500 bg-red-100';
    }
  };

  return (
    <div className={`flex items-center px-2 py-1 rounded text-sm font-medium ${getComplianceColor(complianceStatus)}`}>
      {complianceStatus === 'compliant' && <CheckCircle className="h-4 w-4 mr-1" />}
      {complianceStatus === 'issues' && <AlertCircle className="h-4 w-4 mr-1" />}
      {complianceStatus === 'critical' && <AlertTriangle className="h-4 w-4 mr-1" />}
      {complianceStatus === 'compliant' ? 'Compliant' : 
       complianceStatus === 'issues' ? 'Compliance Issues' : 'Critical Violations'}
    </div>
  );
};
