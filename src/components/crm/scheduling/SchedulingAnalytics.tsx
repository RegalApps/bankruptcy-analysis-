
interface SchedulingAnalyticsProps {
  clientId?: string;
  clientName?: string;
}

export const SchedulingAnalytics = ({ clientId, clientName }: SchedulingAnalyticsProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Scheduling Analytics</h2>
      <p className="text-sm text-muted-foreground">
        {clientName ? `View scheduling metrics for ${clientName}` : "View scheduling metrics for all clients"}
      </p>
      
      <div className="h-[400px] border rounded-lg bg-background/50 flex items-center justify-center">
        <p className="text-muted-foreground">Analytics dashboards will be displayed here</p>
      </div>
    </div>
  );
};
