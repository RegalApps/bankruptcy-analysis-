
// Will fix the title property reference errors by ensuring the title is properly accessed
import React, { useState } from 'react';
import { Risk, Form31RiskViewProps } from './types';
import {
  AlertTriangle,
  Info,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const Form31RiskView: React.FC<Form31RiskViewProps> = ({ 
  risks,
  documentId,
  onRiskSelect,
  activeRiskId
}) => {
  const [expandedRiskId, setExpandedRiskId] = useState<string | null>(null);

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'high': return 'text-red-500 border-red-200 bg-red-50';
      case 'medium': return 'text-amber-600 border-amber-200 bg-amber-50';
      case 'low': return 'text-green-600 border-green-200 bg-green-50';
      default: return 'text-blue-600 border-blue-200 bg-blue-50';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch(severity) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Info className="h-4 w-4 text-amber-600" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const handleRiskClick = (risk: Risk) => {
    const riskId = risk.id || `risk-${risk.type.replace(/\s+/g, '-').toLowerCase()}`;
    if (onRiskSelect) {
      onRiskSelect(riskId);
    }
    setExpandedRiskId(expandedRiskId === riskId ? null : riskId);
  };

  const isRiskActive = (risk: Risk) => {
    const riskId = risk.id || `risk-${risk.type.replace(/\s+/g, '-').toLowerCase()}`;
    return riskId === activeRiskId;
  };

  // Group risks by section
  const groupedRisks = risks.reduce((acc, risk) => {
    const section = (risk as any).section || 'General';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(risk);
    return acc;
  }, {} as Record<string, Risk[]>);

  return (
    <div className="space-y-4">
      {Object.entries(groupedRisks).map(([section, sectionRisks]) => (
        <div key={section} className="border rounded-md overflow-hidden">
          <div className="bg-muted/50 px-3 py-2 font-medium text-sm border-b">
            {section} Risks
          </div>
          <div className="divide-y">
            {sectionRisks.map((risk, idx) => {
              const riskTitle = risk.title || risk.type;
              return (
                <div
                  key={`${section}-${idx}`}
                  className={cn(
                    "p-3 cursor-pointer hover:bg-muted/30 transition-colors",
                    isRiskActive(risk) && "bg-primary/10"
                  )}
                  onClick={() => handleRiskClick(risk)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      {getSeverityIcon(risk.severity)}
                      <div>
                        <h4 className="font-medium text-sm">{riskTitle}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {risk.description}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn("text-xs", getSeverityColor(risk.severity))}
                    >
                      {risk.severity}
                    </Badge>
                  </div>

                  {isRiskActive(risk) && (
                    <div className="mt-3 pl-6 border-t pt-3">
                      <dl className="space-y-2 text-xs">
                        {risk.regulation && (
                          <div>
                            <dt className="font-semibold">Regulation:</dt>
                            <dd className="text-muted-foreground">{risk.regulation}</dd>
                          </div>
                        )}
                        {risk.impact && (
                          <div>
                            <dt className="font-semibold">Impact:</dt>
                            <dd className="text-muted-foreground">{risk.impact}</dd>
                          </div>
                        )}
                        {risk.solution && (
                          <div>
                            <dt className="font-semibold">Recommended Solution:</dt>
                            <dd className="bg-green-50 p-2 rounded text-green-800 mt-1">{risk.solution}</dd>
                          </div>
                        )}
                      </dl>
                      <div className="mt-3 flex justify-end">
                        <Button variant="outline" size="sm" className="text-xs">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View in Document
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {risks.length === 0 && (
        <div className="text-center py-8 border rounded-md">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
          <h3 className="font-medium">No Risks Detected</h3>
          <p className="text-sm text-muted-foreground mt-1">
            This document appears to be compliant with Form 31 requirements.
          </p>
        </div>
      )}
    </div>
  );
};
