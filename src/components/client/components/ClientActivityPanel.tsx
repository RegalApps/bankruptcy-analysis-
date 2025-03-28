
import { Client } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RealTimeAnalyticsPanel } from "@/components/activity/components/RealTimeAnalyticsPanel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface ClientActivityPanelProps {
  client: Client;
}

export const ClientActivityPanel = ({ client }: ClientActivityPanelProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activityData, setActivityData] = useState<any>(null);
  
  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setActivityData({
        formData: {
          total_monthly_income: "5000",
          spouse_total_monthly_income: "3500",
          total_essential_expenses: "3000",
          total_discretionary_expenses: "1500",
          total_savings: "1000",
          total_insurance: "500"
        },
        previousMonthData: {
          total_monthly_income: "4800",
          spouse_total_monthly_income: "3500",
          total_essential_expenses: "2800",
          total_discretionary_expenses: "1700",
          total_savings: "800",
          total_insurance: "500"
        },
        historicalData: {
          months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          income: [7500, 8000, 8200, 8300, 8500, 8500],
          expenses: [5500, 5800, 5700, 5900, 6000, 5000],
          savings: [2000, 2200, 2500, 2400, 2500, 3500]
        }
      });
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [client.id]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Financial Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            {activityData && (
              <RealTimeAnalyticsPanel
                formData={activityData.formData}
                previousMonthData={activityData.previousMonthData}
                historicalData={activityData.historicalData}
              />
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">Document Added</p>
                  <p className="text-sm text-muted-foreground">Form 47 - Consumer Proposal</p>
                </div>
                <p className="text-sm text-muted-foreground">2 days ago</p>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">Client Information Updated</p>
                  <p className="text-sm text-muted-foreground">Address changed</p>
                </div>
                <p className="text-sm text-muted-foreground">1 week ago</p>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">New Document Uploaded</p>
                  <p className="text-sm text-muted-foreground">Financial Statement</p>
                </div>
                <p className="text-sm text-muted-foreground">2 weeks ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};
