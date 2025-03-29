
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Calendar, Check, Clock, FileText, AlertTriangle } from "lucide-react";
import { ClientMetrics } from "../../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatDate";

interface MetricDetailsProps {
  activeMetric: string;
  metrics: ClientMetrics;
  onClose: () => void;
}

// Mock data for the metric details templates
const TASK_DATA = [
  { 
    id: "task-1", 
    title: "Review financial statements", 
    dueDate: new Date().toISOString(),
    priority: "high",
    status: "pending"
  },
  { 
    id: "task-2", 
    title: "Collect missing identity documents", 
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    priority: "medium",
    status: "pending"
  },
  { 
    id: "task-3", 
    title: "Schedule follow-up meeting", 
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    priority: "low",
    status: "pending"
  }
];

const DOCUMENT_DATA = [
  {
    id: "doc-1",
    title: "Form 47 - Consumer Proposal",
    status: "pending-review",
    dueDate: new Date(Date.now() + 86400000).toISOString()
  },
  {
    id: "doc-2",
    title: "Income Verification",
    status: "pending-signature",
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString()
  }
];

const DEADLINE_DATA = [
  {
    id: "deadline-1",
    title: "Submit Form 47",
    daysLeft: 1,
    priority: "high"
  }
];

export const MetricDetails: React.FC<MetricDetailsProps> = ({ 
  activeMetric, 
  metrics, 
  onClose 
}) => {
  const getMetricDetails = () => {
    switch (activeMetric) {
      case 'tasks':
        return {
          title: 'Open Tasks',
          value: metrics.openTasks,
          description: 'Tasks that need to be completed for this client.',
          action: 'View All Tasks',
          icon: <Check className="h-5 w-5" />,
          data: TASK_DATA
        };
      case 'documents':
        return {
          title: 'Pending Documents',
          value: metrics.pendingDocuments,
          description: 'Documents that are awaiting review or signature.',
          action: 'View Documents',
          icon: <FileText className="h-5 w-5" />,
          data: DOCUMENT_DATA
        };
      case 'deadlines':
        return {
          title: 'Urgent Deadlines',
          value: metrics.urgentDeadlines,
          description: 'Tasks or documents with upcoming deadlines.',
          action: 'View Deadlines',
          icon: <Clock className="h-5 w-5" />,
          data: DEADLINE_DATA
        };
      default:
        return {
          title: 'Unknown Metric',
          value: 0,
          description: 'No details available.',
          action: 'Close',
          icon: <AlertTriangle className="h-5 w-5" />,
          data: []
        };
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending-review':
        return 'bg-blue-100 text-blue-800';
      case 'pending-signature':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const details = getMetricDetails();

  const renderTaskList = () => {
    return TASK_DATA.map(task => (
      <Card key={task.id} className="p-2 mb-2 text-sm">
        <div className="flex justify-between items-start">
          <div className="font-medium">{task.title}</div>
          <Badge className={`text-xs py-0 h-5 ${getPriorityClass(task.priority)}`}>{task.priority}</Badge>
        </div>
        <div className="flex justify-between items-center mt-1">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        </div>
      </Card>
    ));
  };

  const renderDocumentList = () => {
    return DOCUMENT_DATA.map(doc => (
      <Card key={doc.id} className="p-2 mb-2 text-sm">
        <div className="flex justify-between items-start">
          <div className="font-medium">{doc.title}</div>
          <Badge className={`text-xs py-0 h-5 ${getStatusClass(doc.status)}`}>
            {doc.status.replace('-', ' ')}
          </Badge>
        </div>
        <div className="flex items-center mt-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          <span>Due: {formatDate(doc.dueDate)}</span>
        </div>
      </Card>
    ));
  };

  const renderDeadlineList = () => {
    return DEADLINE_DATA.map(deadline => (
      <Card key={deadline.id} className="p-2 mb-2 text-sm">
        <div className="flex justify-between items-start">
          <div className="font-medium">{deadline.title}</div>
          <Badge className="bg-red-100 text-red-800 text-xs py-0 h-5">
            {deadline.daysLeft} {deadline.daysLeft === 1 ? 'day' : 'days'} left
          </Badge>
        </div>
        <div className="flex items-center mt-1 text-xs text-muted-foreground">
          <AlertTriangle className="h-3 w-3 mr-1" />
          <span>Requires immediate attention</span>
        </div>
      </Card>
    ));
  };

  const renderMetricContent = () => {
    switch (activeMetric) {
      case 'tasks':
        return renderTaskList();
      case 'documents':
        return renderDocumentList();
      case 'deadlines':
        return renderDeadlineList();
      default:
        return <div className="text-center py-2 text-muted-foreground">No data available</div>;
    }
  };

  return (
    <Card className="p-3 mb-2 relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-2 right-2 h-6 w-6" 
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center mb-2">
        <div className="bg-muted rounded-full p-1.5 mr-2">
          {details.icon}
        </div>
        <div>
          <h3 className="text-lg font-medium">{details.title}</h3>
          <p className="text-xs text-muted-foreground">{details.description}</p>
        </div>
      </div>
      
      <ScrollArea className="h-[150px] mb-3">
        {renderMetricContent()}
      </ScrollArea>
      
      <Button size="sm" className="w-full">{details.action}</Button>
    </Card>
  );
};
