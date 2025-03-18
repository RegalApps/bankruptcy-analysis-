
import { CheckCircle2 } from "lucide-react";

interface AIRecommendationProps {
  caseType: string;
}

export const AIRecommendation = ({ caseType }: AIRecommendationProps) => {
  // Determine recommended trustee based on case type
  const recommendedTrustee = caseType === "Bankruptcy" ? "John Smith" : "Sarah Johnson";
  
  return (
    <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-4">
      <div className="flex items-start space-x-2">
        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
        <div>
          <h4 className="text-sm font-medium text-green-800">AI Recommendation</h4>
          <p className="text-xs text-green-700 mt-1">
            Based on the case type "{caseType}", we recommend scheduling this appointment with {recommendedTrustee}, who specializes in this area.
          </p>
        </div>
      </div>
    </div>
  );
};
