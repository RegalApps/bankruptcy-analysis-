
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ClientDashboard = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Activity feed coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};
