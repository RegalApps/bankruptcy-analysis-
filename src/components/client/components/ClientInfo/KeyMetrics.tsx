
import React from "react";
import { Card } from "@/components/ui/card";
import { ClientMetrics } from "../../types";

interface KeyMetricsProps {
  metrics: ClientMetrics;
  onMetricClick: (metricName: string) => void;
}

export const KeyMetrics: React.FC<KeyMetricsProps> = ({ metrics, onMetricClick }) => {
  const getUrgencyClass = (value: number, threshold: number = 1) => {
    return value >= threshold ? "text-red-500" : "text-green-500";
  };

  return (
    <Card className="p-2 mb-2 overflow-auto">
      <h3 className="text-sm font-medium mb-1 px-1">Key Metrics</h3>
      <div className="grid grid-cols-3 gap-1">
        <div 
          className="text-center p-1.5 rounded-md cursor-pointer hover:bg-accent transition-colors"
          onClick={() => onMetricClick('tasks')}
        >
          <div className={`text-lg font-semibold ${getUrgencyClass(metrics.openTasks, 3)}`}>
            {metrics.openTasks}
          </div>
          <div className="text-xs text-muted-foreground">Tasks</div>
        </div>
        <div 
          className="text-center p-1.5 rounded-md cursor-pointer hover:bg-accent transition-colors"
          onClick={() => onMetricClick('documents')}
        >
          <div className={`text-lg font-semibold ${getUrgencyClass(metrics.pendingDocuments, 2)}`}>
            {metrics.pendingDocuments}
          </div>
          <div className="text-xs text-muted-foreground">Pending Docs</div>
        </div>
        <div 
          className="text-center p-1.5 rounded-md cursor-pointer hover:bg-accent transition-colors"
          onClick={() => onMetricClick('deadlines')}
        >
          <div className={`text-lg font-semibold ${getUrgencyClass(metrics.urgentDeadlines)}`}>
            {metrics.urgentDeadlines}
          </div>
          <div className="text-xs text-muted-foreground">Urgent</div>
        </div>
      </div>
    </Card>
  );
};
