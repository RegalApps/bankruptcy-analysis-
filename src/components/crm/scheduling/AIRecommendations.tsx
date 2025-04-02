
import React from "react";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, ArrowRight, AlertCircle } from "lucide-react";

interface AISuggestion {
  id: string;
  type: 'reschedule' | 'optimize' | 'conflict' | 'reminder';
  description: string;
  priority: 'high' | 'medium' | 'low';
  action?: string;
}

interface AIRecommendationsProps {
  suggestions: AISuggestion[];
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({ suggestions }) => {
  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'reschedule':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'optimize':
        return <Clock className="h-4 w-4 text-green-500" />;
      case 'conflict':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'reminder':
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-3">
      {suggestions.length === 0 ? (
        <div className="text-center text-muted-foreground">
          No AI recommendations at this time
        </div>
      ) : (
        suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="flex items-start gap-3 p-2.5 border rounded-md bg-muted/20"
          >
            <div className="mt-0.5">
              {getSuggestionIcon(suggestion.type)}
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm">{suggestion.description}</p>
              {suggestion.action && (
                <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                  {suggestion.action}
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
