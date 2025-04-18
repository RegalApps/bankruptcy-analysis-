
import React from 'react';
import { AlertCircle, AlertTriangle, AlertOctagon, Info } from 'lucide-react';
import { DocumentRisk } from '@/utils/documents/types';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';

interface RiskListProps {
  risks: DocumentRisk[];
}

export const RiskList: React.FC<RiskListProps> = ({ risks }) => {
  return (
    <div className="space-y-3">
      {risks.map((risk) => (
        <RiskItem key={risk.id} risk={risk} />
      ))}
    </div>
  );
};

interface RiskItemProps {
  risk: DocumentRisk;
}

const RiskItem: React.FC<RiskItemProps> = ({ risk }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  // Determine icon based on severity
  const Icon = getSeverityIcon(risk.severity);
  const severityColor = getSeverityColor(risk.severity);
  
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={`border rounded-md overflow-hidden ${getSeverityBorder(risk.severity)}`}
    >
      <div className="flex items-start p-4 gap-3">
        <div className={`p-1.5 rounded-full ${severityColor} flex-shrink-0 mt-0.5`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-base">{risk.type}</h4>
            
            <div className="flex items-center gap-2">
              {risk.regulation && (
                <Badge variant="outline" className="text-xs">
                  {risk.regulation}
                </Badge>
              )}
              
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <span className="sr-only">{isOpen ? 'Close' : 'Open'}</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  >
                    <path d="M1 7h12M7 1v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${isOpen ? 'hidden' : 'block'}`} />
                    <path d="M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${!isOpen ? 'hidden' : 'block'}`} />
                  </svg>
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 mt-1">
            {risk.description}
          </p>
        </div>
      </div>
      
      <CollapsibleContent>
        <div className="px-4 pb-4 pt-0 border-t space-y-4 mt-1">
          {risk.impact && (
            <div>
              <h5 className="text-sm font-medium text-gray-700">Impact</h5>
              <p className="text-sm mt-1">{risk.impact}</p>
            </div>
          )}
          
          {risk.solution && (
            <div>
              <h5 className="text-sm font-medium text-gray-700">Recommended Action</h5>
              <p className="text-sm mt-1">{risk.solution}</p>
            </div>
          )}
          
          {risk.deadline && (
            <div className="flex justify-between items-center">
              <div>
                <h5 className="text-sm font-medium text-gray-700">Deadline</h5>
                <p className="text-sm">{risk.deadline}</p>
              </div>
              
              {risk.status && (
                <Badge className={getStatusColor(risk.status)}>
                  {formatStatus(risk.status)}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

// Helper functions
function getSeverityIcon(severity: string) {
  switch (severity) {
    case 'critical':
      return AlertOctagon;
    case 'high':
      return AlertCircle;
    case 'medium':
      return AlertTriangle;
    default:
      return Info;
  }
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical':
      return 'bg-red-500';
    case 'high':
      return 'bg-orange-500';
    case 'medium':
      return 'bg-yellow-500';
    default:
      return 'bg-blue-500';
  }
}

function getSeverityBorder(severity: string): string {
  switch (severity) {
    case 'critical':
      return 'border-red-200 bg-red-50';
    case 'high':
      return 'border-orange-200 bg-orange-50';
    case 'medium':
      return 'border-yellow-200 bg-yellow-50';
    default:
      return 'border-blue-200 bg-blue-50';
  }
}

function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'open':
      return 'bg-red-100 text-red-800 hover:bg-red-200 border-red-200';
    case 'reviewing':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200';
    case 'resolved':
      return 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200';
    default:
      return '';
  }
}

function formatStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
