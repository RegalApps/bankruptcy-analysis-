
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ComplianceMonitoringProps {
  clientId?: string;
}

export const ComplianceMonitoring = ({ clientId }: ComplianceMonitoringProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Monitoring</CardTitle>
      </CardHeader>
      <CardContent>
        {!clientId ? (
          <p className="text-muted-foreground">Please select a client to view compliance monitoring information.</p>
        ) : (
          <p className="text-muted-foreground">Compliance monitoring features for client ID: {clientId} coming soon...</p>
        )}
      </CardContent>
    </Card>
  );
};
