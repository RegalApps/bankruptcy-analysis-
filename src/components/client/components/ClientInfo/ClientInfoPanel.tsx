
import React, { useState } from "react";
import { ClientInfoPanelProps } from "../../types";
import { ContactInformation } from "./ContactInformation";
import { KeyMetrics } from "./KeyMetrics";
import { MetricDetails } from "./MetricDetails";
import { TaskManagement } from "./TaskManagement";
import { Badge } from "@/components/ui/badge";

export const ClientInfoPanel: React.FC<ClientInfoPanelProps> = ({ 
  client,
  tasks = [],
  documentCount,
  lastActivityDate,
  documents = [],
  onDocumentSelect,
  selectedDocumentId,
  onClientUpdate
}) => {
  const [activeMetric, setActiveMetric] = useState<string | null>(null);
  
  const handleMetricClick = (metricName: string) => {
    setActiveMetric(activeMetric === metricName ? null : metricName);
  };

  return (
    <div className="h-full flex flex-col p-3">
      <div className="mb-2">
        <h2 className="text-xl font-semibold">{client.name}</h2>
        <div className="flex items-center mt-1 text-sm text-muted-foreground">
          <Badge variant="outline" className="mr-2">{client.status}</Badge>
          <span>{client.location}</span>
        </div>
      </div>

      <div className="flex-shrink-0 mb-2">
        <ContactInformation client={client} />
      </div>
      
      <div className="flex-shrink-0 mb-2">
        <KeyMetrics 
          metrics={client.metrics} 
          onMetricClick={handleMetricClick} 
        />
      </div>
      
      <div className="flex-1 min-h-0 overflow-auto pb-4">
        {activeMetric ? (
          <MetricDetails 
            activeMetric={activeMetric} 
            metrics={client.metrics} 
            onClose={() => setActiveMetric(null)}
          />
        ) : (
          <TaskManagement 
            tasks={tasks} 
          />
        )}
      </div>
    </div>
  );
};
