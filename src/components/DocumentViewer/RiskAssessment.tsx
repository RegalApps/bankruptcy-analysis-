
import { AlertTriangle, CheckCircle, Info, ArrowRight, ClipboardList } from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

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
        return 'bg-green-50';
      case 'medium':
        return 'bg-yellow-50';
      case 'high':
        return 'bg-red-50';
      default:
        return 'bg-gray-50';
    }
  };

  const handleCreateTask = async (risk: Risk) => {
    try {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      const { error: taskError } = await supabase
        .from('tasks')
        .insert({
          title: risk.type,
          description: risk.description,
          severity: risk.severity,
          document_id: documentId,
          created_by: user.id,
          regulation: risk.regulation,
          solution: risk.solution,
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default due date: 1 week
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
    <div className="p-4 rounded-md bg-muted">
      <h3 className="font-medium mb-4">Risk Assessment</h3>
      <div className="space-y-4">
        {risks ? (
          risks.map((risk, index) => (
            <div 
              key={index} 
              className={`space-y-3 p-4 rounded-lg border ${getSeverityBg(risk.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {risk.severity === 'high' ? (
                    <AlertTriangle className={`h-5 w-5 ${getSeverityColor(risk.severity)} mt-0.5 flex-shrink-0`} />
                  ) : (
                    <CheckCircle className={`h-5 w-5 ${getSeverityColor(risk.severity)} mt-0.5 flex-shrink-0`} />
                  )}
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
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-4 shrink-0"
                  onClick={() => handleCreateTask(risk)}
                >
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              </div>

              {risk.impact && (
                <div className="pl-8">
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="font-medium text-foreground">Impact:</p>
                    <p>{risk.impact}</p>
                  </div>
                </div>
              )}

              {risk.requiredAction && (
                <div className="pl-8">
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="font-medium text-foreground">Required Action:</p>
                    <div className="flex items-start">
                      <ArrowRight className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0" />
                      <p>{risk.requiredAction}</p>
                    </div>
                  </div>
                </div>
              )}

              {risk.solution && (
                <div className="pl-8 mt-2">
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="font-medium text-foreground">Solution:</p>
                    <div className="p-2 bg-background rounded border">
                      <p className="whitespace-pre-wrap">{risk.solution}</p>
                    </div>
                  </div>
                </div>
              )}

              {risk.regulation && (
                <div className="pl-8 pt-2 border-t">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Info className="h-3 w-3 mr-1" />
                    <span>Regulation: {risk.regulation}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No risks identified</p>
        )}
      </div>
    </div>
  );
};
