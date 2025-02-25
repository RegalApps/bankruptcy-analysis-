
import { APIIntegration, IntegrationProvider } from "../types";
import { AVAILABLE_INTEGRATIONS, INTEGRATION_FEATURES, INTEGRATION_BENEFITS } from "../constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface IntegrationCardProps {
  integration: APIIntegration;
  onRefresh: () => void;
}

export const IntegrationCard = ({ integration, onRefresh }: IntegrationCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const provider = AVAILABLE_INTEGRATIONS.find(p => p.id === integration.provider_name);
  if (!provider) return null;

  const features = INTEGRATION_FEATURES[integration.provider_name as keyof typeof INTEGRATION_FEATURES] || [];
  const benefit = INTEGRATION_BENEFITS[integration.provider_name as keyof typeof INTEGRATION_BENEFITS];

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
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{provider.description}</p>
        <div className="mt-2 flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Last synced: {integration.last_sync_at ? new Date(integration.last_sync_at).toLocaleString() : 'Never'}
          </Badge>
        </div>
        
        {isExpanded && (
          <div className="mt-4 space-y-4 border-t pt-4">
            <div>
              <h4 className="text-sm font-semibold mb-2">Features:</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            {benefit && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Benefit:</h4>
                <p className="text-sm text-muted-foreground">{benefit}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
