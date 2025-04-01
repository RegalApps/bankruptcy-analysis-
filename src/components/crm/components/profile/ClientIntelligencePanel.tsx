
import { ClientInsightData } from "../../../activity/hooks/predictiveData/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, CheckCircle, Clock, ArrowUp, ArrowDown, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientIntelligencePanelProps {
  insights: ClientInsightData;
}

export const ClientIntelligencePanel = ({ insights }: ClientIntelligencePanelProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'contacted': return 'bg-purple-500';
      case 'in_progress': return 'bg-amber-500';
      case 'proposal_sent': return 'bg-indigo-500';
      case 'closed_won': return 'bg-green-500';
      case 'closed_lost': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskIndicator = () => {
    if (insights?.riskLevel === 'high') {
      return (
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm">No activity in 30 days.</span>
        </div>
      );
    } else if (insights?.riskLevel === 'medium') {
      return (
        <div className="flex items-center gap-2 text-amber-600">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm">High bounce rate.</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm">Engaged last week.</span>
        </div>
      );
    }
  };

  if (!insights) {
    return (
      <div className="h-full p-4 flex items-center justify-center">
        <p className="text-muted-foreground">Select a client to view insights</p>
      </div>
    );
  }

  return (
    <div className="h-full p-4 overflow-auto">
      <h2 className="text-lg font-semibold mb-4">Client Intelligence</h2>
      
      <div className="space-y-6">
        {/* Lead Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Lead Status</label>
          <Select defaultValue="in_progress">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="proposal_sent">Proposal Sent</SelectItem>
              <SelectItem value="closed_won">Closed Won</SelectItem>
              <SelectItem value="closed_lost">Closed Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Account Health Score */}
        <Card className="p-4">
          <CardTitle className="text-sm font-medium mb-2">
            Account Health Score
          </CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Badge variant={insights.riskScore < 40 ? "destructive" : insights.riskScore < 70 ? "outline" : "secondary"}>
                {insights.riskScore < 40 ? "At Risk" : insights.riskScore < 70 ? "Needs Attention" : "Healthy"}
              </Badge>
              <span className="font-bold">{insights.riskScore}%</span>
            </div>
            <Progress value={insights.riskScore} className="h-2" />
          </div>
        </Card>
        
        {/* Risk Assessment */}
        <Card className="p-4">
          <CardTitle className="text-sm font-medium mb-2">
            Risk Assessment
          </CardTitle>
          <div className="space-y-2">
            {getRiskIndicator()}
          </div>
        </Card>
        
        {/* Case Progress */}
        <Card className="p-4">
          <CardTitle className="text-sm font-medium mb-2">
            Case Progress
          </CardTitle>
          <div className="space-y-2">
            <Progress value={insights.caseProgress} className="h-2" />
            <div className="space-y-1 mt-2">
              {insights.milestones?.map((milestone, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Checkbox checked={milestone.completed} id={`milestone-${index}`} />
                  <label htmlFor={`milestone-${index}`} className="text-sm font-medium cursor-pointer">
                    {milestone.name}
                  </label>
                </div>
              ))}
              {!insights.milestones?.length && (
                <p className="text-sm text-muted-foreground">No milestones defined</p>
              )}
            </div>
          </div>
        </Card>
        
        {/* AI Insights & Recommendations */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.aiSuggestions
              .filter(s => s.type !== 'info')
              .map((suggestion, index) => (
                <div 
                  key={index} 
                  className={`p-2 rounded-md text-sm ${
                    suggestion.type === 'urgent' ? 'bg-red-50 text-red-700' :
                    suggestion.type === 'warning' ? 'bg-amber-50 text-amber-700' :
                    'bg-blue-50 text-blue-700'
                  }`}
                >
                  {suggestion.message}
                  
                  {suggestion.action && (
                    <Button 
                      variant="link" 
                      className={`p-0 h-auto text-xs mt-1 ${
                        suggestion.type === 'urgent' ? 'text-red-600' :
                        suggestion.type === 'warning' ? 'text-amber-600' :
                        'text-blue-600'
                      }`}
                    >
                      {suggestion.action}
                    </Button>
                  )}
                </div>
              ))}
              
            {insights.aiSuggestions.filter(s => s.type !== 'info').length === 0 && (
              <div className="text-center py-2 text-muted-foreground">
                <p className="text-sm">No insights available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Missing Checkbox component - let's create it here
interface CheckboxProps {
  checked?: boolean;
  id: string;
}

const Checkbox = ({ checked = false, id }: CheckboxProps) => {
  return (
    <div className={`h-4 w-4 rounded-sm border flex items-center justify-center ${checked ? 'bg-primary border-primary' : 'border-gray-300'}`}>
      {checked && <CheckCircle className="h-3 w-3 text-white" />}
    </div>
  );
};
