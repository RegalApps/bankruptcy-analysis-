
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

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
        <h3 className="text-lg font-bold">Predictive Analysis: {clientName}</h3>
        {lastRefreshed && (
          <p className="text-xs text-muted-foreground">
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
