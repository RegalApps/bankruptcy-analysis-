
import React, { useState } from 'react';
import { AlertTriangle, Clock, Info, CheckCircle2, FileCheck, Pen, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Risk, Form31RiskViewProps } from './types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from "sonner";

export const Form31RiskView: React.FC<Form31RiskViewProps> = ({ 
  risks,
  documentId,
  activeRiskId,
  onRiskSelect
}) => {
  const [showCreateClient, setShowCreateClient] = useState(true);
  
  // Look for GreenTech Supplies and use special handling if found
  const isGreenTechForm = risks.some(r => 
    (r.description?.toLowerCase() || '').includes('greentech') ||
    ((r.metadata as Record<string, any>)?.clientName || '').toLowerCase().includes('greentech')
  );
  
  // Use special handling for GreenTech Supplies
  if (isGreenTechForm) {
    return (
      <GreenTechForm31RiskView 
        documentId={documentId} 
        risks={risks} 
        activeRiskId={activeRiskId}
        onRiskSelect={onRiskSelect}
        showCreateClient={showCreateClient}
        setShowCreateClient={setShowCreateClient}
      />
    );
  }
  
  // Group risks by section
  const section4Risks = risks.filter(r => 
    (r.description?.includes('Section 4') || 
    r.description?.includes('Claim Category')) || 
    ((r.metadata as any)?.section === 'Section 4')
  );
    
  const section5Risks = risks.filter(r => 
    (r.description?.includes('Section 5') || 
    r.description?.includes('Relatedness')) ||
    ((r.metadata as any)?.section === 'Section 5')
  );
    
  const section6Risks = risks.filter(r => 
    (r.description?.includes('Section 6') || 
    r.description?.includes('Disclosure') || 
    r.description?.includes('Transfer')) ||
    ((r.metadata as any)?.section === 'Section 6')
  );
    
  const dateRisks = risks.filter(r => 
    r.description?.includes('Date Format')
  );
    
  const trusteeRisks = risks.filter(r => 
    r.description?.includes('Trustee Declaration')
  );
    
  const scheduleRisks = risks.filter(r => 
    r.description?.includes('Schedule "A"') || 
    r.description?.includes('Schedule A')
  );
    
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
          {sectionRisks.map((risk, idx) => {
            // Find if this risk is active
            const isActive = activeRiskId?.includes(sectionRisks[idx].type || '') || 
                             activeRiskId?.includes(`risk-${idx}`) ||
                             false;
                             
            return (
              <div 
                key={`${title}-risk-${idx}`}
                className={`border rounded-md p-3 ${isActive 
                  ? 'bg-primary/5 border-primary/40 shadow-sm ring-1 ring-primary/20' 
                  : 'bg-muted/10 hover:bg-muted/20 cursor-pointer'}`}
                onClick={() => onRiskSelect && onRiskSelect(`risk-${idx}`)}
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
            );
          })}
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

// Special component for GreenTech Supplies Inc. Form 31
const GreenTechForm31RiskView: React.FC<{
  documentId: string;
  risks: Risk[];
  activeRiskId?: string | null;
  onRiskSelect?: (riskId: string | null) => void;
  showCreateClient: boolean;
  setShowCreateClient: (show: boolean) => void;
}> = ({ 
  documentId, 
  risks,
  activeRiskId,
  onRiskSelect,
  showCreateClient,
  setShowCreateClient
}) => {
  // Group risks by severity
  const highRisks = risks.filter(risk => risk.severity === 'high');
  const mediumRisks = risks.filter(risk => risk.severity === 'medium');
  const lowRisks = risks.filter(risk => risk.severity === 'low');
  
  const handleCreateClient = async () => {
    try {
      // Display success message
      toast.success("Created client profile for GreenTech Supplies Inc.");
      
      // Hide the create client button
      setShowCreateClient(false);
    } catch (error) {
      console.error("Error creating client profile:", error);
      toast.error("Failed to create client profile");
    }
  };
  
  function renderRiskItem(risk: Risk, index: number, type: 'high' | 'medium' | 'low') {
    // Check if this risk is active
    const riskId = `risk-${risks.indexOf(risk)}`;
    const isActive = activeRiskId === riskId;
    
    return (
      <div 
        key={`${type}-${index}`} 
        className={`border rounded-md p-3 bg-muted/10 mb-3 ${
          isActive ? 'bg-primary/5 border-primary/40 shadow-sm ring-1 ring-primary/20' : 
          'hover:bg-muted/20 cursor-pointer'
        }`}
        onClick={() => onRiskSelect && onRiskSelect(riskId)}
      >
        <div className="flex justify-between items-start mb-2">
          <span className="font-medium text-sm">{risk.description}</span>
          <Badge variant={
            type === 'high' ? 'destructive' : 
            type === 'medium' ? 'default' : 
            'outline'
          }>
            {type === 'high' ? 'High' : type === 'medium' ? 'Medium' : 'Low'}
          </Badge>
        </div>
        
        <div className="text-sm text-muted-foreground mb-2">
          <p className="mb-1">{(risk.metadata as any)?.details || risk.impact}</p>
          <p className="mb-1"><span className="font-medium">BIA Reference:</span> {risk.regulation}</p>
          <p className="mb-1"><span className="font-medium">Impact:</span> {risk.impact}</p>
          <p><span className="font-medium">Solution:</span> {risk.solution}</p>
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/40">
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 mr-1" />
            Due: {risk.deadline}
          </div>
          
          <Button size="sm" variant="secondary" className="text-xs">
            Mark Resolved
          </Button>
        </div>
      </div>
    );
  };

  return (
    <ScrollArea className="pr-4 max-h-[600px]">
      <div className="p-1">
        <div className="mb-4 flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold mb-1">Form 31 - GreenTech Supplies Inc.</h3>
            <p className="text-muted-foreground text-sm">
              Proof of Claim - $89,355.00
            </p>
          </div>
          {showCreateClient && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleCreateClient}
            >
              <Pen className="h-3 w-3" />
              Create Client
            </Button>
          )}
        </div>
        
        <div className="mb-5">
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
            <p className="text-sm text-amber-800">
              This form has critical compliance issues that need to be addressed before filing. 
              See the risk assessment below.
            </p>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-medium flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            High Risk Issues
          </h4>
          {highRisks.map((risk, idx) => renderRiskItem(risk, idx, 'high'))}
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Medium Risk Issues
          </h4>
          {mediumRisks.map((risk, idx) => renderRiskItem(risk, idx, 'medium'))}
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-blue-500" />
            Low Risk Issues
          </h4>
          {lowRisks.map((risk, idx) => renderRiskItem(risk, idx, 'low'))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <Button 
            className="w-full flex items-center gap-2 justify-center"
            onClick={() => window.open('/document-tasks', '_blank')}
          >
            Export Risk Report
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};

// Add supabase import
import { supabase } from "@/lib/supabase";
