
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/utils/formatDate";
import { User, Mail, Phone, CalendarClock, CheckCircle, AlertCircle, Search, XCircle } from "lucide-react";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
}

interface Client {
  id: string;
  name: string;
  status: string;
  location: string;
  email?: string;
  phone?: string;
  metrics: {
    openTasks: number;
    pendingDocuments: number;
    urgentDeadlines: number;
  };
}

interface ClientInfoPanelProps {
  client: Client;
  tasks: Task[];
}

export const ClientInfoPanel: React.FC<ClientInfoPanelProps> = ({ client, tasks }) => {
  const [activeMetric, setActiveMetric] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const getTaskPriorityClass = (priority: string) => {
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

  const handleCompleteTask = (taskId: string) => {
    console.log("Complete task:", taskId);
    // In a real app, this would update the task status
  };
  
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleMetricClick = (metricName: string) => {
    setActiveMetric(activeMetric === metricName ? null : metricName);
  };
  
  const renderMetricDetails = () => {
    switch (activeMetric) {
      case 'openTasks':
        return (
          <div className="p-3 bg-muted/30 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">Open Tasks</h4>
              <Button variant="ghost" size="sm" onClick={() => setActiveMetric(null)}>
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              There are {client.metrics.openTasks} open tasks that require attention.
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
              <Button variant="ghost" size="sm" onClick={() => setActiveMetric(null)}>
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              {client.metrics.pendingDocuments} documents are awaiting review or signature.
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
              <Button variant="ghost" size="sm" onClick={() => setActiveMetric(null)}>
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              {client.metrics.urgentDeadlines} deadlines require immediate attention.
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

  return (
    <div className="h-full flex flex-col p-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{client.name}</h2>
        <div className="flex items-center mt-1 text-sm text-muted-foreground">
          <Badge variant="outline" className="mr-2">{client.status}</Badge>
          <span>{client.location}</span>
        </div>
      </div>

      <Card className="p-3 mb-4">
        <h3 className="text-sm font-medium mb-2">Contact Information</h3>
        <div className="space-y-2">
          {client.email && (
            <div className="flex items-center text-sm">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">{client.email}</span>
            </div>
          )}
          {client.phone && (
            <div className="flex items-center text-sm">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">{client.phone}</span>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-3 mb-4">
        <h3 className="text-sm font-medium mb-2">Key Metrics</h3>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div 
            className="p-2 bg-muted/40 rounded-md cursor-pointer hover:bg-muted/60 transition-colors"
            onClick={() => handleMetricClick('openTasks')}
          >
            <div className="text-lg font-medium">{client.metrics.openTasks}</div>
            <div className="text-xs text-muted-foreground">Open Tasks</div>
          </div>
          <div 
            className="p-2 bg-muted/40 rounded-md cursor-pointer hover:bg-muted/60 transition-colors"
            onClick={() => handleMetricClick('pendingDocuments')}
          >
            <div className="text-lg font-medium">{client.metrics.pendingDocuments}</div>
            <div className="text-xs text-muted-foreground">Pending Docs</div>
          </div>
          <div 
            className="p-2 bg-muted/40 rounded-md cursor-pointer hover:bg-muted/60 transition-colors"
            onClick={() => handleMetricClick('urgentDeadlines')}
          >
            <div className="text-lg font-medium">{client.metrics.urgentDeadlines}</div>
            <div className="text-xs text-muted-foreground">Urgent</div>
          </div>
        </div>
      </Card>
      
      {activeMetric ? (
        renderMetricDetails()
      ) : (
        <>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Task Management</h3>
            <Button variant="ghost" size="sm" className="h-6 text-xs">+ Add Task</Button>
          </div>
          
          <div className="relative mb-3">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tasks..."
              className="pl-9 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-2 pr-2">
              {filteredTasks.length > 0 ? (
                filteredTasks.map(task => (
                  <Card key={task.id} className="p-3 text-sm">
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-medium">{task.title}</div>
                      <Badge className={getTaskPriorityClass(task.priority)}>{task.priority}</Badge>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <CalendarClock className="h-3 w-3 mr-1" />
                        <span>{formatDate(task.dueDate)}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-green-600" 
                          onClick={() => handleCompleteTask(task.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  {searchQuery ? "No tasks match your search" : "No tasks available"}
                </div>
              )}
            </div>
          </ScrollArea>
        </>
      )}
    </div>
  );
};
