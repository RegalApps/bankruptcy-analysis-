
import { 
  Alert, 
  AlertTitle, 
  AlertDescription 
} from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// AI suggestions type
export interface AISuggestion {
  id: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
}

interface AIRecommendationsProps {
  suggestions: AISuggestion[];
}

export const AIRecommendations = ({ suggestions }: AIRecommendationsProps) => {
  return (
    <div className="space-y-3">
      {suggestions.map((suggestion) => (
        <Alert 
          key={suggestion.id} 
          className={
            suggestion.priority === 'high' 
              ? 'border-red-300 bg-red-50' 
              : suggestion.priority === 'medium' 
                ? 'border-amber-300 bg-amber-50' 
                : 'border-blue-300 bg-blue-50'
          }
        >
          <AlertTitle className="flex items-center gap-2 text-sm">
            {suggestion.priority === 'high' ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : suggestion.priority === 'medium' ? (
              <AlertCircle className="h-4 w-4 text-amber-500" /> 
            ) : (
              <AlertCircle className="h-4 w-4 text-blue-500" />
            )}
            {suggestion.priority === 'high' 
              ? 'Urgent Action Needed' 
              : suggestion.priority === 'medium' 
                ? 'Recommended Action' 
                : 'Insight'
            }
          </AlertTitle>
          <AlertDescription className="text-sm mt-1">
            {suggestion.message}
            {suggestion.actionable && (
              <div className="mt-2">
                <Button size="sm" variant="outline" className="text-xs">Take Action</Button>
              </div>
            )}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};
