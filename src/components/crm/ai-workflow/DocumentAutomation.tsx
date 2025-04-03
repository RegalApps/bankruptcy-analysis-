
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DocumentAutomationProps {
  clientId?: string;
}

export const DocumentAutomation = ({ clientId }: DocumentAutomationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Automation</CardTitle>
      </CardHeader>
      <CardContent>
        {!clientId ? (
          <p className="text-muted-foreground">Please select a client to view document automation options.</p>
        ) : (
          <p className="text-muted-foreground">Document automation features for client ID: {clientId} coming soon...</p>
        )}
      </CardContent>
    </Card>
  );
};
