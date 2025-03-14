
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PredictiveHeaderProps {
  clientName: string;
  lastRefreshed: Date | null;
  onRefresh: () => void;
  isLoading: boolean;
}

export const PredictiveHeader: React.FC<PredictiveHeaderProps> = ({
  clientName,
  lastRefreshed,
  onRefresh,
  isLoading
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold">Financial Forecast</h3>
          <Badge variant="outline" className="bg-blue-50">AI Powered</Badge>
        </div>
        {lastRefreshed && (
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: {lastRefreshed.toLocaleString()}
          </p>
        )}
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRefresh}
        disabled={isLoading}
        className="mt-2 md:mt-0"
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
        {isLoading ? 'Refreshing...' : 'Refresh Data'}
      </Button>
    </div>
  );
};
