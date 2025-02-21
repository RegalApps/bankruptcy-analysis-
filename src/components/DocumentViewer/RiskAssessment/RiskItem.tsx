
import { ArrowRight, Info, CheckCircle, AlertTriangle, AlertOctagon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { Risk } from "./types";
import { getSeverityBg, getSeverityColor, getSeverityIcon } from "./utils";
import { CreateTaskButton } from "./CreateTaskButton";

interface RiskItemProps {
  risk: Risk;
  documentId: string;
}

export const RiskItem = ({ risk, documentId }: RiskItemProps) => {
  const getIcon = () => {
    switch (getSeverityIcon(risk.severity)) {
      case 'CheckCircle':
        return <CheckCircle className="h-5 w-5" />;
      case 'AlertTriangle':
        return <AlertTriangle className="h-5 w-5" />;
      case 'AlertOctagon':
        return <AlertOctagon className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  return (
    <div className={`space-y-3 p-4 rounded-lg border ${getSeverityBg(risk.severity)}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className={`${getSeverityColor(risk.severity)} mt-0.5 flex-shrink-0`}>
            {getIcon()}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{risk.type}</h4>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${getSeverityBg(risk.severity)} ${getSeverityColor(risk.severity)}`}>
                {risk.severity.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{risk.description}</p>
          </div>
        </div>
        <CreateTaskButton risk={risk} documentId={documentId} />
      </div>

      {risk.impact && (
        <div className="pl-8">
          <div className="text-sm space-y-1">
            <p className="font-medium">Impact:</p>
            <Alert variant="destructive" className="bg-opacity-50">
              <AlertTitle>Potential Impact</AlertTitle>
              <AlertDescription>{risk.impact}</AlertDescription>
            </Alert>
          </div>
        </div>
      )}

      {risk.requiredAction && (
        <div className="pl-8">
          <div className="text-sm space-y-1">
            <p className="font-medium">Required Action:</p>
            <div className="flex items-start">
              <ArrowRight className="h-4 w-4 mt-0.5 mr-1 flex-shrink-0" />
              <p className="text-muted-foreground">{risk.requiredAction}</p>
            </div>
          </div>
        </div>
      )}

      {risk.solution && (
        <div className="pl-8 mt-2">
          <div className="text-sm space-y-1">
            <p className="font-medium">Recommended Solution:</p>
            <div className="p-3 bg-background rounded border">
              <p className="whitespace-pre-wrap text-muted-foreground">{risk.solution}</p>
            </div>
          </div>
        </div>
      )}

      {risk.regulation && (
        <div className="pl-8 pt-2 border-t">
          <Tooltip>
            <TooltipTrigger className="flex items-center text-sm text-muted-foreground">
              <Info className="h-4 w-4 mr-1" />
              <span>Regulation Reference</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{risk.regulation}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );
};
