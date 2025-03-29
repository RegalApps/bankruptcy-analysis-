
import React from "react";
import { X, AlertCircle, CheckCircle2, FileText, Calendar, Clock, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
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
  // Different templates based on the active metric
  const renderMetricContent = () => {
    switch (activeMetric) {
      case 'openTasks':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Open Tasks ({metrics.openTasks})</h3>
              <Badge variant="outline" className="bg-blue-50">Active</Badge>
            </div>
            
            <ScrollArea className="h-[250px]">
              <div className="space-y-2">
                {[...Array(metrics.openTasks)].map((_, i) => (
                  <Card key={i} className="p-3 border-l-4 border-blue-500">
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        {i % 3 === 0 ? (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        ) : i % 3 === 1 ? (
                          <Clock className="h-4 w-4 text-orange-500" />
                        ) : (
                          <UserCog className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {i % 3 === 0 ? "Follow up with client" : 
                           i % 3 === 1 ? "Review document submission" :
                           "Prepare client meeting notes"}
                        </p>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            Due {i % 3 === 0 ? "Today" : i % 3 === 1 ? "Tomorrow" : "Next week"}
                          </span>
                          <Badge className="ml-2 px-1 py-0 text-[10px]" variant={
                            i % 3 === 0 ? "destructive" : i % 3 === 1 ? "default" : "secondary"
                          }>
                            {i % 3 === 0 ? "High" : i % 3 === 1 ? "Medium" : "Low"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        );
      
      case 'pendingDocuments':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Pending Documents ({metrics.pendingDocuments})</h3>
              <Badge variant="outline" className="bg-amber-50">Waiting</Badge>
            </div>
            
            <ScrollArea className="h-[250px]">
              <div className="space-y-2">
                {[...Array(metrics.pendingDocuments)].map((_, i) => (
                  <Card key={i} className="p-3 border-l-4 border-amber-500">
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        <FileText className="h-4 w-4 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {i % 2 === 0 ? "Form 47 - Consumer Proposal" : "Bank Statement Verification"}
                        </p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-muted-foreground mr-2">
                            Status: {i % 2 === 0 ? "Needs Signature" : "Needs Review"}
                          </span>
                          <Badge className="px-1 py-0 text-[10px]" variant={
                            i % 2 === 0 ? "destructive" : "default"
                          }>
                            {i % 2 === 0 ? "Urgent" : "Medium"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        );
      
      case 'urgentDeadlines':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Urgent Deadlines ({metrics.urgentDeadlines})</h3>
              <Badge variant="destructive">Critical</Badge>
            </div>
            
            <ScrollArea className="h-[250px]">
              <div className="space-y-2">
                {[...Array(metrics.urgentDeadlines)].map((_, i) => (
                  <Card key={i} className="p-3 border-l-4 border-red-500">
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {i === 0 ? "Form Submission Deadline" : "Client Action Required"}
                        </p>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="text-xs text-red-500 font-medium">
                            Due Today
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {i === 0 
                            ? "Consumer proposal must be filed today to avoid penalties" 
                            : "Client must sign and return documents by end of day"}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        );
      
      default:
        return (
          <div className="text-center p-6">
            <p className="text-muted-foreground">No details available</p>
          </div>
        );
    }
  };

  return (
    <Card className="p-4 mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">
          {activeMetric === 'openTasks' ? 'Open Tasks Details' : 
           activeMetric === 'pendingDocuments' ? 'Pending Documents Details' : 
           activeMetric === 'urgentDeadlines' ? 'Urgent Deadlines Details' : 
           'Metric Details'}
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {renderMetricContent()}
      
      <div className="mt-4 flex justify-end">
        <Button size="sm" variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </Card>
  );
};
