
import React from "react";
import { Card } from "@/components/ui/card";
import { ClientMetrics } from "../../types";
import { CheckCircle2, FileText, AlertCircle } from "lucide-react";

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
          className="p-2 bg-blue-50 rounded-md cursor-pointer hover:bg-blue-100 transition-colors"
          onClick={() => onMetricClick('openTasks')}
        >
          <div className="flex justify-center mb-1">
            <CheckCircle2 className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-lg font-medium">{metrics.openTasks}</div>
          <div className="text-xs text-muted-foreground">Open Tasks</div>
        </div>
        <div 
          className="p-2 bg-amber-50 rounded-md cursor-pointer hover:bg-amber-100 transition-colors"
          onClick={() => onMetricClick('pendingDocuments')}
        >
          <div className="flex justify-center mb-1">
            <FileText className="h-5 w-5 text-amber-500" />
          </div>
          <div className="text-lg font-medium">{metrics.pendingDocuments}</div>
          <div className="text-xs text-muted-foreground">Pending Docs</div>
        </div>
        <div 
          className="p-2 bg-red-50 rounded-md cursor-pointer hover:bg-red-100 transition-colors"
          onClick={() => onMetricClick('urgentDeadlines')}
        >
          <div className="flex justify-center mb-1">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="text-lg font-medium">{metrics.urgentDeadlines}</div>
          <div className="text-xs text-muted-foreground">Urgent</div>
        </div>
      </div>
    </Card>
  );
};
