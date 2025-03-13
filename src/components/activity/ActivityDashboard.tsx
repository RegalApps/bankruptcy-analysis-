
import { Client } from "./types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateFormButton } from "./components/CreateFormButton";

interface ActivityDashboardProps {
  selectedClient: Client | null;
}

export const ActivityDashboard = ({ selectedClient }: ActivityDashboardProps) => {
  if (!selectedClient) {
    return (
      <Card className="py-12">
        <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
          <h3 className="text-lg font-medium">No Client Selected</h3>
          <p className="text-muted-foreground max-w-md">
            Please select a client above to view their financial dashboard.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{selectedClient.name}'s Financial Dashboard</h2>
        
        {/* Add the Create Form Button */}
        <CreateFormButton clientId={selectedClient.id} />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Financial Overview</CardTitle>
          <CardDescription>Summary of income, expenses and savings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Dashboard data will appear here once the client has submitted their financial information.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
