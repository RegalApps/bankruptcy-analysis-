
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileWarning, 
  FileCheck, 
  Clock, 
  ShieldAlert, 
  CalendarClock,
  FileText
} from "lucide-react";
import { Risk } from "./types";
import { RiskItem } from "./RiskItem";

interface Form47RiskViewProps {
  risks: Risk[];
  documentId: string;
}

export const Form47RiskView: React.FC<Form47RiskViewProps> = ({ 
  risks, 
  documentId 
}) => {
  // Filter for Form 47 specific categories
  const paymentRisks = risks.filter(r => 
    r.type.toLowerCase().includes('payment') || 
    r.description.toLowerCase().includes('payment')
  );
  
  const complianceRisks = risks.filter(r => 
    r.type.toLowerCase().includes('compliance') || 
    r.regulation?.toLowerCase().includes('66.13') ||
    r.regulation?.toLowerCase().includes('66.14')
  );
  
  const documentationRisks = risks.filter(r => 
    r.type.toLowerCase().includes('missing') || 
    r.type.toLowerCase().includes('incomplete') ||
    r.description.toLowerCase().includes('signature') ||
    r.description.toLowerCase().includes('witness')
  );
  
  const deadlineRisks = risks.filter(r =>
    r.type.toLowerCase().includes('deadline') ||
    r.description.toLowerCase().includes('deadline') ||
    r.deadline?.toLowerCase().includes('immediately')
  );
  
  // Count risks by severity for the progress bar
  const totalRisks = risks.length;
  const highRisks = risks.filter(r => r.severity === 'high').length;
  const completionPercentage = totalRisks ? ((totalRisks - highRisks) / totalRisks) * 100 : 100;
  
  // Skip component if no Form 47 specific risks
  if (risks.length === 0) return null;
  
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
            <Badge variant={highRisks > 0 ? "destructive" : "outline"} className="ml-auto">
              {highRisks > 0 
                ? `${highRisks} Critical Issue${highRisks > 1 ? 's' : ''}` 
                : 'Review Complete'}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Document Compliance</span>
              <span className="text-muted-foreground">{Math.round(completionPercentage)}% Complete</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            {paymentRisks.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-orange-500" />
                <span>Payment Schedule Issues: {paymentRisks.length}</span>
              </div>
            )}
            
            {complianceRisks.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <ShieldAlert className="h-4 w-4 text-red-500" />
                <span>Compliance Issues: {complianceRisks.length}</span>
              </div>
            )}
            
            {documentationRisks.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <FileWarning className="h-4 w-4 text-amber-500" />
                <span>Documentation Issues: {documentationRisks.length}</span>
              </div>
            )}
            
            {deadlineRisks.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <CalendarClock className="h-4 w-4 text-blue-500" />
                <span>Deadline Issues: {deadlineRisks.length}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Risk Categories */}
      {paymentRisks.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-500" />
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
            Compliance Issues
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
    </div>
  );
};
