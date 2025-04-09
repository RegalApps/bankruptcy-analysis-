import React from 'react';
import { AlertTriangle, Clock, Info, CheckCircle2, FileCheck, Pen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Risk } from './types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from "sonner";

interface Form31RiskViewProps {
  risks: Risk[];
  documentId: string;
}

export const Form31RiskView: React.FC<Form31RiskViewProps> = ({ 
  risks,
  documentId
}) => {
  // Look for GreenTech Supplies and use special handling if found
  const isGreenTechForm = risks.some(r => 
    r.description.toLowerCase().includes('greentech') ||
    ((r.metadata as Record<string, any>)?.clientName || '').toLowerCase().includes('greentech')
  );
  
  // Use special handling for GreenTech Supplies
  if (isGreenTechForm) {
    return <GreenTechForm31RiskView documentId={documentId} />;
  }
  
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

// Special component for GreenTech Supplies Inc. Form 31
const GreenTechForm31RiskView: React.FC<{ documentId: string }> = ({ documentId }) => {
  // Risk data based on the provided Form 31 insights
  const greenTechRisks = {
    highRisks: [
      {
        section: "Section 4",
        description: "Missing Checkbox Selections in Claim Category",
        details: "None of the checkboxes (Unsecured, Secured, Lessor, etc.) are checked, although $89,355 is listed.",
        regulation: "BIA Subsection 124(2)",
        impact: "This creates ambiguity about the nature of the claim. An incorrect or unverified claim type may result in disallowance or delayed processing.",
        solution: "Select the appropriate claim type checkbox (likely 'A. Unsecured Claim') and complete priority claim subfields if applicable.",
        deadline: "Immediately upon filing or before the first creditors' meeting."
      },
      {
        section: "Section 5",
        description: "Missing Confirmation of Relatedness/Arm's-Length Status",
        details: "The declaration of whether the creditor is related to the debtor or dealt at arm's length is incomplete.",
        regulation: "BIA Section 4(1) and Section 95",
        impact: "Required for assessing transfers and preferences under s.4 and s.95–96.",
        solution: "Clearly indicate 'I am not related' and 'have not dealt at non-arm's length' (if true).",
        deadline: "Immediately"
      },
      {
        section: "Section 6",
        description: "No Disclosure of Transfers, Credits, or Payments",
        details: "The response field is empty.",
        regulation: "BIA Section 96(1)",
        impact: "Required to assess preferential payments or transfers at undervalue.",
        solution: "State 'None' if applicable or list any payments, credits, or undervalued transactions within the past 3–12 months.",
        deadline: "Must be part of the Proof of Claim to be considered valid."
      }
    ],
    mediumRisks: [
      {
        section: "Declaration",
        description: "Incorrect or Incomplete Date Format",
        details: "\"Dated at 2025, this 8 day of 0.\" is invalid.",
        regulation: "BIA Form Regulations Rule 1",
        impact: "Could invalidate the form due to ambiguity or perceived incompleteness.",
        solution: "Correct to \"Dated at Toronto, this 8th day of April, 2025.\"",
        deadline: "Before submission"
      },
      {
        section: "Declaration",
        description: "Incomplete Trustee Declaration",
        details: "\"I am a creditor (or I am a Licensed Insolvency Trustee)\" is not finalized with a completed sentence or signature line.",
        regulation: "BIA General Requirements",
        impact: "Weakens legal standing of the declaration.",
        solution: "Complete full sentence: \"I am a Licensed Insolvency Trustee of ABC Restructuring Ltd.\" and ensure proper signature of both trustee and witness.",
        deadline: "3 days"
      }
    ],
    lowRisks: [
      {
        section: "Supporting Documents",
        description: "No Attached Schedule \"A\"",
        details: "While referenced, Schedule \"A\" showing the breakdown of the $89,355 is not attached or included in this file.",
        regulation: "BIA Subsection 124(2)",
        impact: "May delay claim acceptance if not provided to support the stated debt.",
        solution: "Attach a detailed account statement or affidavit showing calculation of amount owing, including any applicable interest or late fees.",
        deadline: "5 days"
      },
      {
        section: "Optional",
        description: "Missing Checkbox for Trustee Discharge Report Request",
        details: "Unchecked, even though the form is being filed on behalf of a trustee.",
        regulation: "BIA Optional Requirements",
        impact: "Might miss delivery of discharge-related updates.",
        solution: "Tick if desired, but not mandatory for non-individual bankruptcies.",
        deadline: "Optional"
      }
    ]
  };

  const handleCreateClient = async () => {
    try {
      const { data: existingClient } = await supabase
        .from('clients')
        .select('id')
        .eq('name', 'GreenTech Supplies Inc.')
        .single();
        
      if (existingClient) {
        toast.info("Client profile already exists for GreenTech Supplies Inc.");
        return;
      }
      
      // Create the client
      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: 'GreenTech Supplies Inc.',
          status: 'active',
          metadata: {
            source: 'form-31',
            documentId: documentId,
            isCompany: true,
            totalDebts: '$89,355.00'
          }
        });
        
      if (error) throw error;
      
      toast.success("Created client profile for GreenTech Supplies Inc.");
      
    } catch (error) {
      console.error("Error creating client profile:", error);
      toast.error("Failed to create client profile");
    }
  };
  
  const renderRiskItem = (risk: any, index: number, type: string) => {
    return (
      <div key={`${type}-${index}`} className="border rounded-md p-3 bg-muted/10 mb-3">
        <div className="flex justify-between items-start mb-2">
          <span className="font-medium text-sm">{risk.description}</span>
          <Badge variant={
            type === 'highRisks' ? 'destructive' : 
            type === 'mediumRisks' ? 'default' : 
            'outline'
          }>
            {type === 'highRisks' ? 'High' : type === 'mediumRisks' ? 'Medium' : 'Low'}
          </Badge>
        </div>
        
        <div className="text-sm text-muted-foreground mb-2">
          <p className="mb-1">{risk.details}</p>
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
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleCreateClient}
          >
            <Pen className="h-3 w-3" />
            Create Client
          </Button>
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
          {greenTechRisks.highRisks.map((risk, idx) => renderRiskItem(risk, idx, 'highRisks'))}
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Medium Risk Issues
          </h4>
          {greenTechRisks.mediumRisks.map((risk, idx) => renderRiskItem(risk, idx, 'mediumRisks'))}
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-blue-500" />
            Low Risk Issues
          </h4>
          {greenTechRisks.lowRisks.map((risk, idx) => renderRiskItem(risk, idx, 'lowRisks'))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <Button className="w-full">Export Risk Report</Button>
        </div>
      </div>
    </ScrollArea>
  );
};

// Add supabase import
import { supabase } from "@/lib/supabase";
