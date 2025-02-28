
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface PredictiveHeaderProps {
  clientName: string;
  lastRefreshed: Date | null;
  onRefresh: () => void;
  isLoading: boolean;
}

export const PredictiveHeader = ({ 
  clientName, 
  lastRefreshed, 
  onRefresh, 
  isLoading 
}: PredictiveHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold mb-1">Financial Predictive Analysis for {clientName}</h2>
        <p className="text-sm text-muted-foreground">
          {lastRefreshed ? (
            <>
              Updated {lastRefreshed.toLocaleTimeString()} ({(Date.now() - lastRefreshed.getTime()) < 60000 ? 'Just now' : 
                `${Math.floor((Date.now() - lastRefreshed.getTime()) / 60000)} minutes ago`})
            </>
          ) : (
            "Loading data..."
          )}
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh Analysis
      </Button>
    </div>
  );
};
