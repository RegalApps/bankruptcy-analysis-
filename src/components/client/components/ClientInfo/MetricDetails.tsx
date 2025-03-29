
import React from "react";
import { Card } from "@/components/ui/card";
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
  const getMetricDetails = () => {
    switch (activeMetric) {
      case 'openTasks':
        return {
          title: 'Open Tasks',
          value: metrics.openTasks,
          description: 'Tasks that need to be completed for this client.',
          action: 'View All Tasks'
        };
      case 'pendingDocuments':
        return {
          title: 'Pending Documents',
          value: metrics.pendingDocuments,
          description: 'Documents that are awaiting review or signature.',
          action: 'View Documents'
        };
      case 'urgentDeadlines':
        return {
          title: 'Urgent Deadlines',
          value: metrics.urgentDeadlines,
          description: 'Tasks or documents with upcoming deadlines.',
          action: 'View Deadlines'
        };
      default:
        return {
          title: 'Unknown Metric',
          value: 0,
          description: 'No details available.',
          action: 'Close'
        };
    }
  };

  const details = getMetricDetails();

  return (
    <Card className="p-4 mb-4 relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-2 right-2 h-6 w-6" 
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <h3 className="text-lg font-medium mb-2">{details.title}</h3>
      <div className="text-3xl font-bold mb-2">{details.value}</div>
      <p className="text-sm text-muted-foreground mb-4">{details.description}</p>
      
      <Button size="sm" className="w-full">{details.action}</Button>
    </Card>
  );
};
