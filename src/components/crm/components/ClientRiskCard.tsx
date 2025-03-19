
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, AlertCircle, Info, Shield, FileText } from "lucide-react";
import { ClientInsightData } from "../../activity/hooks/predictiveData/types";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

  const getRiskLevelExplanation = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return "The client demonstrates strong financial stability with manageable debt levels and consistent income. Their documents are well-organized and compliant with regulatory requirements. Regular monitoring is still recommended but there are no immediate concerns.";
      case 'medium':
        return "The client shows some financial pressure points with moderately elevated debt-to-income ratio. There may be minor documentation issues or compliance gaps that require attention. Closer monitoring and proactive intervention is recommended to prevent escalation to high risk.";
      case 'high':
        return "The client exhibits significant financial distress with high debt levels relative to income. There are notable documentation deficiencies or compliance violations that require immediate attention. Urgent intervention is recommended to mitigate legal and financial risks.";
    }
  };

  const getRiskScoreExplanation = (score: number) => {
    if (score < 30) {
      return "Score indicates minimal risk with strong compliance adherence and financial stability. The client maintains proper documentation and follows required procedures.";
    } else if (score < 60) {
      return "Score indicates moderate risk factors present. Some documentation may require updates or financial indicators show potential pressure points that should be monitored.";
    } else {
      return "Score indicates significant risk factors that require immediate attention. Serious compliance issues or financial distress indicators are present that could lead to regulatory or legal consequences if not addressed promptly.";
    }
  };

  const getComplianceExplanation = (status: 'compliant' | 'issues' | 'critical') => {
    switch (status) {
      case 'compliant':
        return "All regulatory requirements are being met. Documentation is complete, accurate, and up-to-date. The client is adhering to all applicable legal and regulatory obligations.";
      case 'issues':
        return "There are minor compliance gaps or documentation issues that need to be addressed. While not critical, these issues could escalate if left unattended and should be resolved according to regulatory timeframes.";
      case 'critical':
        return "Serious compliance violations or documentation deficiencies exist that require immediate attention. These issues pose significant legal or regulatory risks and must be addressed as a top priority to avoid penalties or other consequences.";
    }
  };
  
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
          
          <Collapsible className="w-full space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Risk Level Explanation</h4>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                  <Info className="h-4 w-4" />
                  <span className="sr-only">Toggle explanation</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2">
              <div className="rounded-md bg-muted p-3">
                <p className="text-sm">{getRiskLevelExplanation(riskLevel)}</p>
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          <Collapsible className="w-full space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Risk Score Breakdown</h4>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                  <Info className="h-4 w-4" />
                  <span className="sr-only">Toggle explanation</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2">
              <div className="rounded-md bg-muted p-3">
                <div className="space-y-2">
                  <p className="text-sm">{getRiskScoreExplanation(riskScore)}</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Financial factors</span>
                      <span>{Math.round(riskScore * 0.4)}/40</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Documentation completeness</span>
                      <span>{Math.round(riskScore * 0.3)}/30</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Regulatory compliance</span>
                      <span>{Math.round(riskScore * 0.3)}/30</span>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
          
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
          
          <Collapsible className="w-full space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Compliance Details</h4>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                  <Info className="h-4 w-4" />
                  <span className="sr-only">Toggle explanation</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2">
              <div className="rounded-md bg-muted p-3">
                <p className="text-sm">{getComplianceExplanation(complianceStatus)}</p>
                
                {complianceStatus !== 'compliant' && (
                  <div className="mt-3 space-y-2">
                    <h5 className="text-xs font-semibold">Key compliance areas requiring attention:</h5>
                    <ul className="list-disc list-inside text-xs space-y-1">
                      {complianceStatus === 'issues' ? (
                        <>
                          <li>Documentation updates needed for recent transactions</li>
                          <li>Minor discrepancies in financial reporting</li>
                          <li>Upcoming regulatory deadlines require preparation</li>
                        </>
                      ) : (
                        <>
                          <li>Significant documentation gaps in required filings</li>
                          <li>Potential violations of regulatory requirements</li>
                          <li>Missing signatures on critical documents</li>
                          <li>Discrepancies between declared and actual financial position</li>
                        </>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Recommended Actions</h4>
              <Badge variant="outline" className="text-xs">
                {complianceStatus === 'compliant' ? 'Routine' : 
                 complianceStatus === 'issues' ? 'Medium Priority' : 'Urgent'}
              </Badge>
            </div>
            <ul className="mt-2 space-y-1">
              {complianceStatus === 'compliant' ? (
                <>
                  <li className="text-xs flex items-start gap-1">
                    <FileText className="h-3 w-3 mt-0.5 text-green-500" />
                    <span>Schedule quarterly compliance review</span>
                  </li>
                  <li className="text-xs flex items-start gap-1">
                    <FileText className="h-3 w-3 mt-0.5 text-green-500" />
                    <span>Update client on positive compliance standing</span>
                  </li>
                </>
              ) : complianceStatus === 'issues' ? (
                <>
                  <li className="text-xs flex items-start gap-1">
                    <FileText className="h-3 w-3 mt-0.5 text-amber-500" />
                    <span>Schedule documentation review within 14 days</span>
                  </li>
                  <li className="text-xs flex items-start gap-1">
                    <FileText className="h-3 w-3 mt-0.5 text-amber-500" />
                    <span>Prepare compliance action plan for missing items</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="text-xs flex items-start gap-1">
                    <FileText className="h-3 w-3 mt-0.5 text-red-500" />
                    <span>Immediate documentation review required (within 48 hours)</span>
                  </li>
                  <li className="text-xs flex items-start gap-1">
                    <FileText className="h-3 w-3 mt-0.5 text-red-500" />
                    <span>Schedule urgent client meeting to address violations</span>
                  </li>
                  <li className="text-xs flex items-start gap-1">
                    <FileText className="h-3 w-3 mt-0.5 text-red-500" />
                    <span>Prepare regulatory response plan with legal review</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
