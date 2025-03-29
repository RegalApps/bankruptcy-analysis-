
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/utils/formatDate";
import { User, Mail, Phone, CalendarClock, CheckCircle, AlertCircle } from "lucide-react";

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
          <div className="p-2 bg-muted/40 rounded-md">
            <div className="text-lg font-medium">{client.metrics.openTasks}</div>
            <div className="text-xs text-muted-foreground">Open Tasks</div>
          </div>
          <div className="p-2 bg-muted/40 rounded-md">
            <div className="text-lg font-medium">{client.metrics.pendingDocuments}</div>
            <div className="text-xs text-muted-foreground">Pending Docs</div>
          </div>
          <div className="p-2 bg-muted/40 rounded-md">
            <div className="text-lg font-medium">{client.metrics.urgentDeadlines}</div>
            <div className="text-xs text-muted-foreground">Urgent</div>
          </div>
        </div>
      </Card>

      <h3 className="text-sm font-medium mb-2 flex items-center justify-between">
        <span>Task Management</span>
        <Button variant="ghost" size="sm" className="h-6 text-xs">+ Add Task</Button>
      </h3>

      <ScrollArea className="flex-1">
        <div className="space-y-2 pr-2">
          {tasks.map(task => (
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
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
