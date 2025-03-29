
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ClientMetrics } from "../../types";

interface MetricDetailsProps {
  activeMetric: string;
  metrics: ClientMetrics;
  onClose: () => void;
}

export const MetricDetails: React.FC<MetricDetailsProps> = ({ 
  activeMetric, 
  metrics, 
  onClose 
}) => {
  switch (activeMetric) {
    case 'openTasks':
      return (
        <div className="p-3 bg-muted/30 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Open Tasks</h4>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            There are {metrics.openTasks} open tasks that require attention.
          </p>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" className="text-xs">View All Tasks</Button>
          </div>
        </div>
      );
    case 'pendingDocuments':
      return (
        <div className="p-3 bg-muted/30 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Pending Documents</h4>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            {metrics.pendingDocuments} documents are awaiting review or signature.
          </p>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" className="text-xs">Review Documents</Button>
          </div>
        </div>
      );
    case 'urgentDeadlines':
      return (
        <div className="p-3 bg-muted/30 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Urgent Deadlines</h4>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            {metrics.urgentDeadlines} deadlines require immediate attention.
          </p>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" className="text-xs">View Calendar</Button>
          </div>
        </div>
      );
    default:
      return null;
  }
};
