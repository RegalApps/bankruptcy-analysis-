
import { Client } from "./types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateFormButton } from "./components/CreateFormButton";

interface PredictiveAnalysisProps {
  selectedClient: Client | null;
}

export const PredictiveAnalysis = ({ selectedClient }: PredictiveAnalysisProps) => {
  if (!selectedClient) {
    return (
      <Card className="py-12">
        <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
          <h3 className="text-lg font-medium">No Client Selected</h3>
          <p className="text-muted-foreground max-w-md">
            Please select a client above to view predictive analysis.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{selectedClient.name}'s Predictive Analysis</h2>
        
        {/* Add the Create Form Button */}
        <CreateFormButton clientId={selectedClient.id} />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Financial Forecasting</CardTitle>
          <CardDescription>Predictions based on historical data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Predictive analysis will appear here once the client has enough financial data history.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Low Risk</div>
            <p className="text-sm text-muted-foreground mt-1">Based on cash flow stability</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Savings Potential</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$420/month</div>
            <p className="text-sm text-muted-foreground mt-1">Projected additional savings</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Income Seasonality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{"8.5%"}</div>
            <p className="text-sm text-muted-foreground mt-1">Variance in monthly income</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
