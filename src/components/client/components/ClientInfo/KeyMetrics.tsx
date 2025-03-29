
import React from "react";
import { Card } from "@/components/ui/card";
import { ClientMetrics } from "../../types";

interface KeyMetricsProps {
  metrics: ClientMetrics;
  onMetricClick: (metricName: string) => void;
}

export const KeyMetrics: React.FC<KeyMetricsProps> = ({ metrics, onMetricClick }) => {
  return (
    <Card className="p-3 mb-4">
      <h3 className="text-sm font-medium mb-2">Key Metrics</h3>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div 
          className="p-2 bg-muted/40 rounded-md cursor-pointer hover:bg-muted/60 transition-colors"
          onClick={() => onMetricClick('openTasks')}
        >
          <div className="text-lg font-medium">{metrics.openTasks}</div>
          <div className="text-xs text-muted-foreground">Open Tasks</div>
        </div>
        <div 
          className="p-2 bg-muted/40 rounded-md cursor-pointer hover:bg-muted/60 transition-colors"
          onClick={() => onMetricClick('pendingDocuments')}
        >
          <div className="text-lg font-medium">{metrics.pendingDocuments}</div>
          <div className="text-xs text-muted-foreground">Pending Docs</div>
        </div>
        <div 
          className="p-2 bg-muted/40 rounded-md cursor-pointer hover:bg-muted/60 transition-colors"
          onClick={() => onMetricClick('urgentDeadlines')}
        >
          <div className="text-lg font-medium">{metrics.urgentDeadlines}</div>
          <div className="text-xs text-muted-foreground">Urgent</div>
        </div>
      </div>
    </Card>
  );
};
