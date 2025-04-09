
import React from 'react';
import { AlertTriangle, Clock, Info, CheckCircle2, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Risk } from './types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface Form31RiskViewProps {
  risks: Risk[];
  documentId: string;
}

export const Form31RiskView: React.FC<Form31RiskViewProps> = ({ 
  risks,
  documentId
}) => {
  // Group risks by section
  const section4Risks = risks.filter(r => 
    r.description.includes('Section 4') || 
    r.description.includes('Claim Category'));
    
  const section5Risks = risks.filter(r => 
    r.description.includes('Section 5') || 
    r.description.includes('Relatedness'));
    
  const section6Risks = risks.filter(r => 
    r.description.includes('Section 6') || 
    r.description.includes('Disclosure') || 
    r.description.includes('Transfer'));
    
  const dateRisks = risks.filter(r => 
    r.description.includes('Date Format'));
    
  const trusteeRisks = risks.filter(r => 
    r.description.includes('Trustee Declaration'));
    
  const scheduleRisks = risks.filter(r => 
    r.description.includes('Schedule "A"') || 
    r.description.includes('Schedule A'));
    
  const otherRisks = risks.filter(r => 
    !section4Risks.includes(r) && 
    !section5Risks.includes(r) &&
    !section6Risks.includes(r) &&
    !dateRisks.includes(r) &&
    !trusteeRisks.includes(r) &&
    !scheduleRisks.includes(r));

  if (!risks || risks.length === 0) {
    return (
      <div className="text-center p-6">
        <FileCheck className="h-8 w-8 text-green-500 mx-auto mb-2" />
        <h3 className="text-lg font-semibold mb-2">Form 31 Compliant</h3>
        <p className="text-muted-foreground text-sm">
          No compliance issues detected in this Proof of Claim form.
        </p>
      </div>
    );
  }

  const renderRiskSection = (sectionRisks: Risk[], title: string, icon: React.ReactNode) => {
    if (sectionRisks.length === 0) return null;
    
    return (
      <div className="mb-4">
        <h4 className="font-medium flex items-center gap-2 mb-2">
          {icon}
          {title}
        </h4>
        <div className="space-y-3">
          {sectionRisks.map((risk, idx) => (
            <div 
              key={`${title}-risk-${idx}`}
              className="border rounded-md p-3 bg-muted/10"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-sm">{risk.description}</span>
                <Badge variant={
                  risk.severity === 'high' ? 'destructive' : 
                  risk.severity === 'medium' ? 'default' : 
                  'outline'
                }>
                  {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)}
                </Badge>
              </div>
              
              {risk.solution && (
                <div className="text-sm text-muted-foreground mb-2">
                  <span className="font-medium">Solution:</span> {risk.solution}
                </div>
              )}
              
              {risk.deadline && (
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/40">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    Due: {risk.deadline}
                  </div>
                  
                  <Button size="sm" variant="secondary" className="text-xs">
                    Mark Resolved
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <ScrollArea className="pr-4 max-h-[600px]">
      <div className="p-1">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-1">Form 31 - Proof of Claim</h3>
          <p className="text-muted-foreground text-sm">
            {risks.length} compliance {risks.length === 1 ? 'issue' : 'issues'} detected
          </p>
        </div>

        {renderRiskSection(
          section4Risks, 
          "Section 4: Claim Category Issues", 
          <AlertTriangle className="h-4 w-4 text-red-500" />
        )}
        
        {renderRiskSection(
          section5Risks, 
          "Section 5: Relatedness Declaration", 
          <AlertTriangle className="h-4 w-4 text-red-500" />
        )}
        
        {renderRiskSection(
          section6Risks, 
          "Section 6: Disclosure Issues", 
          <AlertTriangle className="h-4 w-4 text-red-500" />
        )}
        
        {renderRiskSection(
          dateRisks, 
          "Date Format Issues", 
          <Info className="h-4 w-4 text-amber-500" />
        )}
        
        {renderRiskSection(
          trusteeRisks, 
          "Trustee Declaration Issues", 
          <Info className="h-4 w-4 text-amber-500" />
        )}
        
        {renderRiskSection(
          scheduleRisks, 
          "Supporting Documentation", 
          <Info className="h-4 w-4 text-blue-500" />
        )}
        
        {renderRiskSection(
          otherRisks, 
          "Other Issues", 
          <Info className="h-4 w-4 text-muted-foreground" />
        )}
        
        <div className="mt-6 pt-4 border-t">
          <Button className="w-full">Export Risk Report</Button>
        </div>
      </div>
    </ScrollArea>
  );
};
