
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { ClientInsightData } from "../../activity/hooks/predictiveData/types";
import { RiskLevelBadge } from "./clientRisk/RiskLevelBadge";
import { ComplianceBadge } from "./clientRisk/ComplianceBadge";
import { RiskLevelExplanation } from "./clientRisk/RiskLevelExplanation";
import { RiskScoreBreakdown } from "./clientRisk/RiskScoreBreakdown";
import { ComplianceDetails } from "./clientRisk/ComplianceDetails";
import { RecommendedActions } from "./clientRisk/RecommendedActions";

interface ClientRiskCardProps {
  insights: ClientInsightData;
}

export const ClientRiskCard = ({ insights }: ClientRiskCardProps) => {
  const { riskLevel, riskScore, complianceStatus } = insights;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-amber-500" />
          Risk & Compliance Assessment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Risk Level</p>
              <RiskLevelBadge riskLevel={riskLevel} />
            </div>
            
            <div className="text-right space-y-1">
              <p className="text-sm text-muted-foreground">Risk Score</p>
              <p className="text-2xl font-bold">{riskScore}</p>
            </div>
          </div>
          
          <RiskLevelExplanation riskLevel={riskLevel} />
          
          <RiskScoreBreakdown riskScore={riskScore} />
          
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground mb-2">Compliance Status</p>
            <ComplianceBadge complianceStatus={complianceStatus} />
          </div>
          
          <ComplianceDetails complianceStatus={complianceStatus} />
          
          <RecommendedActions complianceStatus={complianceStatus} />
        </div>
      </CardContent>
    </Card>
  );
};
