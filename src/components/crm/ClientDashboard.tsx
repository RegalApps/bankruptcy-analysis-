
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useClientInsights } from "./hooks/useClientInsights";
import { ClientRiskCard } from "./components/ClientRiskCard";
import { CaseProgressCard } from "./components/CaseProgressCard";
import { AiInsightsCard } from "./components/AiInsightsCard";
import { UpcomingDeadlinesCard } from "./components/UpcomingDeadlinesCard";
import { RecentActivitiesCard } from "./components/RecentActivitiesCard";
import { Skeleton } from "@/components/ui/skeleton";

interface ClientDashboardProps {
  clientId?: string;
  clientName?: string;
}

export const ClientDashboard = ({ clientId = "1", clientName = "John Doe" }: ClientDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { insightData, isLoading, error } = useClientInsights(clientId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-[180px]" />
          <Skeleton className="h-[180px]" />
          <Skeleton className="h-[180px]" />
        </div>
        <Skeleton className="h-[250px] mt-4" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!insightData) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Client Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Select a client to view their dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{clientName}'s Dashboard</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ClientRiskCard insights={insightData} />
            <CaseProgressCard insights={insightData} />
            <UpcomingDeadlinesCard insights={insightData} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <AiInsightsCard insights={insightData} />
            </div>
            <RecentActivitiesCard insights={insightData} />
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Document Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Document management features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finances">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Financial Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Financial analysis features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Communication Hub</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Communication features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
