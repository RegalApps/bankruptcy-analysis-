
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { RiskItemProps } from './types';
import { getSeverityColor } from './utils/severityUtils';
import { RiskItemHeader } from './components/RiskItemHeader';
import { RiskItemContent } from './components/RiskItemContent';
import { RiskItemFooter } from './components/RiskItemFooter';

export const RiskItem = ({ risk, documentId }: RiskItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <Card className={`${getSeverityColor(risk.severity)} border transition-all`}>
      <CardHeader className="py-3 px-4">
        <RiskItemHeader 
          risk={risk} 
          isExpanded={isExpanded} 
          toggleExpand={toggleExpand} 
        />
      </CardHeader>
      
      {isExpanded && (
        <>
          <CardContent className="px-4 py-2 text-sm">
            <RiskItemContent risk={risk} />
          </CardContent>
          
          <CardFooter className="px-4 py-2 flex justify-end">
            <RiskItemFooter risk={risk} documentId={documentId} />
          </CardFooter>
        </>
      )}
    </Card>
  );
};
