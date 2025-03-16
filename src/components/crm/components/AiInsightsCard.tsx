
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, AlertTriangle, Info, ArrowRight } from "lucide-react";
import { ClientInsightData } from "../../activity/hooks/predictiveData/types";

interface AiInsightsCardProps {
  insights: ClientInsightData;
}

export const AiInsightsCard = ({ insights }: AiInsightsCardProps) => {
  const renderIcon = (type: 'urgent' | 'warning' | 'info') => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          AI Suggestions & Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.aiSuggestions.map((suggestion) => (
            <div 
              key={suggestion.id} 
              className={`p-3 rounded-md ${
                suggestion.type === 'urgent' ? 'bg-red-50 border border-red-100' :
                suggestion.type === 'warning' ? 'bg-amber-50 border border-amber-100' :
                'bg-blue-50 border border-blue-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {renderIcon(suggestion.type)}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${
                    suggestion.type === 'urgent' ? 'text-red-700' :
                    suggestion.type === 'warning' ? 'text-amber-700' :
                    'text-blue-700'
                  }`}>
                    {suggestion.message}
                  </p>
                  
                  {suggestion.action && (
                    <Button 
                      variant="link" 
                      className={`p-0 h-auto text-xs mt-1 ${
                        suggestion.type === 'urgent' ? 'text-red-600' :
                        suggestion.type === 'warning' ? 'text-amber-600' :
                        'text-blue-600'
                      }`}
                    >
                      {suggestion.action} <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {insights.aiSuggestions.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <p>No AI suggestions at this time.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
