
import { APIIntegration, IntegrationProvider } from "../types";
import { AVAILABLE_INTEGRATIONS } from "../constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface IntegrationCardProps {
  integration: APIIntegration;
  onRefresh: () => void;
}

export const IntegrationCard = ({ integration, onRefresh }: IntegrationCardProps) => {
  const provider = AVAILABLE_INTEGRATIONS.find(p => p.id === integration.provider_name);
  if (!provider) return null;

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          {provider.name}
          <Badge 
            variant={integration.status === 'active' ? "default" : "secondary"}
            className="ml-2"
          >
            {integration.status}
          </Badge>
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{provider.description}</p>
        <div className="mt-2 flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Last synced: {integration.last_sync_at ? new Date(integration.last_sync_at).toLocaleString() : 'Never'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
