
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Lightbulb, 
  TrendingUp, 
  DollarSign, 
  ChevronRight, 
  BarChart4,
  Rocket,
  Target
} from "lucide-react";
import { AdvancedRiskMetrics } from "../hooks/predictiveData/types";

interface EnhancedOpportunityPanelProps {
  riskMetrics: AdvancedRiskMetrics | null;
}

export const EnhancedOpportunityPanel = ({ 
  riskMetrics 
}: EnhancedOpportunityPanelProps) => {
  if (!riskMetrics || riskMetrics.opportunities.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-amber-100">
        <CardTitle className="flex items-center gap-2">
          <Rocket className="h-5 w-5 text-amber-600" />
          Financial Growth Opportunities
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Strategic Opportunities */}
          <div className="space-y-4">
            {riskMetrics.opportunities.map((opportunity, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div className={`bg-gradient-to-r ${
                  opportunity.type === 'saving' 
                    ? 'from-blue-50 to-blue-100' 
                    : 'from-green-50 to-green-100'
                } px-4 py-3`}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium flex items-center">
                      {opportunity.type === 'saving' ? (
                        <DollarSign className="h-4 w-4 text-blue-600 mr-2" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                      )}
                      {opportunity.title}
                    </h3>
                    <Badge variant="outline" className={`${
                      opportunity.type === 'saving' 
                        ? 'bg-blue-100 text-blue-800 border-blue-200' 
                        : 'bg-green-100 text-green-800 border-green-200'
                    }`}>
                      {opportunity.type === 'saving' ? 'Cost Saving' : 'Growth'}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground mb-3">{opportunity.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-muted rounded p-2 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Potential Impact</p>
                      <p className="font-bold">
                        {opportunity.potentialSavings || opportunity.potentialGains}
                      </p>
                    </div>
                    <div className="bg-muted rounded p-2 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                      <p className="font-bold">{opportunity.confidence}</p>
                    </div>
                    <div className="bg-muted rounded p-2 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Effort Level</p>
                      <p className="font-bold">{index % 3 === 0 ? 'High' : index % 2 === 0 ? 'Medium' : 'Low'}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" className="text-xs gap-1">
                      View Strategy <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Implementation Timeline */}
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center">
              <Target className="h-4 w-4 text-indigo-500 mr-2" />
              Implementation Timeline
            </h3>
            
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-muted"></div>
              
              <div className="space-y-6 relative ml-8">
                {riskMetrics.opportunities.slice(0, 3).map((opportunity, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-8 w-6 h-6 rounded-full bg-white border-2 border-primary flex items-center justify-center">
                      <span className="text-xs font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{opportunity.title}</h4>
                      <p className="text-xs text-muted-foreground mb-1">
                        Recommended timeframe: {index === 0 ? 'Immediate' : index === 1 ? '1-3 months' : '3-6 months'}
                      </p>
                      <div className="flex items-center text-xs">
                        <Badge variant="outline" className={`${
                          opportunity.type === 'saving' 
                            ? 'bg-blue-50 text-blue-800 border-blue-200' 
                            : 'bg-green-50 text-green-800 border-green-200'
                        }`}>
                          {opportunity.potentialSavings || opportunity.potentialGains}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Financial Impact */}
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <BarChart4 className="h-4 w-4 text-purple-500 mr-2" />
              Potential Financial Impact
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              By implementing all opportunities, your potential annual improvement could be:
            </p>
            
            <div className="bg-white p-3 rounded border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Annual Saving Potential:</span>
                <span className="text-lg font-bold text-green-600">
                  ${(Math.random() * 5000 + 3000).toFixed(0)}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-4">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
              </div>
              <p className="text-xs text-muted-foreground">
                This represents approximately {(Math.random() * 20 + 10).toFixed(1)}% of your annual expenses
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
