
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  ArrowRight, 
  ClipboardList,
  ShieldAlert,
  Timer,
  AlertOctagon
} from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../ui/tooltip";

interface Risk {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  regulation?: string;
  impact?: string;
  requiredAction?: string;
  solution?: string;
}

interface RiskAssessmentProps {
  risks?: Risk[];
  documentId: string;
}

export const RiskAssessment: React.FC<RiskAssessmentProps> = ({ risks, documentId }) => {
  const { toast } = useToast();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'high':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-green-50 dark:bg-green-950/50';
      case 'medium':
        return 'bg-yellow-50 dark:bg-yellow-950/50';
      case 'high':
        return 'bg-red-50 dark:bg-red-950/50';
      default:
        return 'bg-gray-50 dark:bg-gray-950/50';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low':
        return <CheckCircle className="h-5 w-5" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5" />;
      case 'high':
        return <AlertOctagon className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const handleCreateTask = async (risk: Risk) => {
    try {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      // Calculate due date based on severity
      const dueDays = risk.severity === 'high' ? 2 : risk.severity === 'medium' ? 5 : 7;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + dueDays);

      const { error: taskError } = await supabase
        .from('tasks')
        .insert({
          title: `Resolve ${risk.severity} risk: ${risk.type}`,
          description: `${risk.description}\n\nRequired Action: ${risk.requiredAction || 'N/A'}\nImpact: ${risk.impact || 'N/A'}`,
          severity: risk.severity,
          document_id: documentId,
          created_by: user.id,
          regulation: risk.regulation,
          solution: risk.solution,
          due_date: dueDate.toISOString(),
          status: 'pending'
        });

      if (taskError) throw taskError;

      toast({
        title: "Task Created",
        description: `Created task for risk: ${risk.type}`,
      });
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create task"
      });
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Risk Assessment</h3>
          </div>
          {risks && risks.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Timer className="h-4 w-4" />
              <span>Updated {new Date().toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {risks && risks.length > 0 ? (
          <div className="space-y-4">
            {risks.map((risk, index) => (
              <div 
                key={index} 
                className={`space-y-3 p-4 rounded-lg border ${getSeverityBg(risk.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`${getSeverityColor(risk.severity)} mt-0.5 flex-shrink-0`}>
                      {getSeverityIcon(risk.severity)}
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-4 shrink-0"
                      >
                        <ClipboardList className="h-4 w-4 mr-2" />
                        Create Task
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-medium">Create Task for Risk</h4>
                        <p className="text-sm text-muted-foreground">
                          This will create a task with the following due date based on severity:
                        </p>
                        <ul className="text-sm space-y-1">
                          <li>High: 2 days</li>
                          <li>Medium: 5 days</li>
                          <li>Low: 7 days</li>
                        </ul>
                        <Button 
                          className="w-full mt-2" 
                          onClick={() => {
                            handleCreateTask(risk);
                          }}
                        >
                          Confirm Task Creation
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
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
            ))}
          </div>
        ) : (
          <div className="text-center p-6 border rounded-lg bg-muted/10">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No risks identified in this document</p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
