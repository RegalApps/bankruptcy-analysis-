
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileWarning, 
  FileCheck, 
  Clock, 
  ShieldAlert, 
  CalendarClock,
  FileText,
  DollarSign,
  Users,
  AlertCircle
} from "lucide-react";
import { Risk } from "./types";
import { RiskItem } from "./RiskItem";

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
  // Filter for Form 47 specific categories
  const paymentRisks = risks.filter(r => 
    r.type?.toLowerCase().includes('payment') || 
    r.description?.toLowerCase().includes('payment') ||
    r.description?.toLowerCase().includes('dividend') ||
    r.description?.toLowerCase().includes('creditor')
  );
  
  const complianceRisks = risks.filter(r => 
    r.type?.toLowerCase().includes('compliance') || 
    r.regulation?.toLowerCase().includes('66.13') ||
    r.regulation?.toLowerCase().includes('66.14') ||
    r.regulation?.toLowerCase().includes('bia')
  );
  
  const documentationRisks = risks.filter(r => 
    r.type?.toLowerCase().includes('missing') || 
    r.type?.toLowerCase().includes('incomplete') ||
    r.description?.toLowerCase().includes('signature') ||
    r.description?.toLowerCase().includes('witness') ||
    r.description?.toLowerCase().includes('administrator')
  );
  
  const deadlineRisks = risks.filter(r =>
    r.type?.toLowerCase().includes('deadline') ||
    r.description?.toLowerCase().includes('deadline') ||
    r.deadline?.toLowerCase().includes('immediately') ||
    r.description?.toLowerCase().includes('submission')
  );
  
  // Count risks by severity for the progress bar
  const totalRisks = risks.length;
  const highRisks = risks.filter(r => r.severity === 'high').length;
  const mediumRisks = risks.filter(r => r.severity === 'medium').length;
  const completionPercentage = totalRisks ? 
    Math.max(0, ((totalRisks - highRisks - (mediumRisks / 2)) / totalRisks) * 100) : 100;
  
  // Skip component if no risks
  if (risks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center bg-muted/20 rounded-lg space-y-2">
        <FileCheck className="h-10 w-10 text-green-500" />
        <h3 className="font-medium">No Compliance Issues</h3>
        <p className="text-sm text-muted-foreground">
          This Consumer Proposal appears to have no outstanding compliance issues.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Consumer Proposal Review Status</h3>
            </div>
            <Badge variant={highRisks > 0 ? "destructive" : (mediumRisks > 0 ? "outline" : "secondary")} className="ml-auto">
              {highRisks > 0 
                ? `${highRisks} Critical Issue${highRisks > 1 ? 's' : ''}` 
                : (mediumRisks > 0 
                  ? `${mediumRisks} Issue${mediumRisks > 1 ? 's' : ''} to Resolve`
                  : 'Compliant')}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Compliance Status</span>
              <span className="text-muted-foreground">{Math.round(completionPercentage)}% Complete</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            {paymentRisks.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span>Payment Schedule: {paymentRisks.length} issue{paymentRisks.length !== 1 ? 's' : ''}</span>
              </div>
            )}
            
            {complianceRisks.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <ShieldAlert className="h-4 w-4 text-red-500" />
                <span>Regulatory: {complianceRisks.length} issue{complianceRisks.length !== 1 ? 's' : ''}</span>
              </div>
            )}
            
            {documentationRisks.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <FileWarning className="h-4 w-4 text-amber-500" />
                <span>Documentation: {documentationRisks.length} issue{documentationRisks.length !== 1 ? 's' : ''}</span>
              </div>
            )}
            
            {deadlineRisks.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <CalendarClock className="h-4 w-4 text-blue-500" />
                <span>Deadlines: {deadlineRisks.length} issue{deadlineRisks.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Risk Categories */}
      {paymentRisks.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            Payment Schedule Issues
          </h4>
          <div className="space-y-2">
            {paymentRisks.map((risk, index) => (
              <RiskItem key={`payment-${index}`} risk={risk} documentId={documentId} />
            ))}
          </div>
        </div>
      )}
      
      {complianceRisks.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-red-500" />
            Regulatory Compliance Issues
          </h4>
          <div className="space-y-2">
            {complianceRisks.map((risk, index) => (
              <RiskItem key={`compliance-${index}`} risk={risk} documentId={documentId} />
            ))}
          </div>
        </div>
      )}
      
      {documentationRisks.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <FileWarning className="h-4 w-4 text-amber-500" />
            Documentation Issues
          </h4>
          <div className="space-y-2">
            {documentationRisks.map((risk, index) => (
              <RiskItem key={`doc-${index}`} risk={risk} documentId={documentId} />
            ))}
          </div>
        </div>
      )}
      
      {deadlineRisks.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-blue-500" />
            Deadline Issues
          </h4>
          <div className="space-y-2">
            {deadlineRisks.map((risk, index) => (
              <RiskItem key={`deadline-${index}`} risk={risk} documentId={documentId} />
            ))}
          </div>
        </div>
      )}

      {/* Add creditor information section */}
      <div className="space-y-3 mt-4">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-500" />
          Creditor Information
        </h4>
        <Card className="bg-muted/20">
          <CardContent className="p-3 text-sm">
            <p className="text-muted-foreground">
              Form 47 requires complete details of all secured and unsecured creditors, including payment terms.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <span>Review creditor details carefully for compliance with BIA 66.13(2)(c).</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
