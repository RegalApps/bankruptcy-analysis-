
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { ClientInsightData } from "../../activity/hooks/predictiveData/types";

interface ClientRiskCardProps {
  insights: ClientInsightData;
}

export const ClientRiskCard = ({ insights }: ClientRiskCardProps) => {
  const { riskLevel, riskScore, complianceStatus } = insights;
  
  const getRiskColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return 'text-green-500 bg-green-100';
      case 'medium': return 'text-amber-500 bg-amber-100';
      case 'high': return 'text-red-500 bg-red-100';
    }
  };
  
  const getComplianceColor = (status: 'compliant' | 'issues' | 'critical') => {
    switch (status) {
      case 'compliant': return 'text-green-500 bg-green-100';
      case 'issues': return 'text-amber-500 bg-amber-100';
      case 'critical': return 'text-red-500 bg-red-100';
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Risk Assessment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Risk Level</p>
              <div className={`flex items-center px-2 py-1 rounded text-sm font-medium ${getRiskColor(riskLevel)}`}>
                {riskLevel === 'low' && <CheckCircle className="h-4 w-4 mr-1" />}
                {riskLevel === 'medium' && <AlertCircle className="h-4 w-4 mr-1" />}
                {riskLevel === 'high' && <AlertTriangle className="h-4 w-4 mr-1" />}
                {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
              </div>
            </div>
            
            <div className="text-right space-y-1">
              <p className="text-sm text-muted-foreground">Risk Score</p>
              <p className="text-2xl font-bold">{riskScore}</p>
            </div>
          </div>
          
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground mb-2">Compliance Status</p>
            <div className={`flex items-center px-2 py-1 rounded text-sm font-medium ${getComplianceColor(complianceStatus)}`}>
              {complianceStatus === 'compliant' && <CheckCircle className="h-4 w-4 mr-1" />}
              {complianceStatus === 'issues' && <AlertCircle className="h-4 w-4 mr-1" />}
              {complianceStatus === 'critical' && <AlertTriangle className="h-4 w-4 mr-1" />}
              {complianceStatus === 'compliant' ? 'Compliant' : 
               complianceStatus === 'issues' ? 'Compliance Issues' : 'Critical Violations'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
