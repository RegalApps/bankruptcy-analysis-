
import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, CheckCircle } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { Task } from "../../types";

interface TaskManagementProps {
  tasks: Task[];
}

export const TaskManagement: React.FC<TaskManagementProps> = ({ tasks }) => {
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
  
  const templateTasks: Task[] = [
    {
      id: "template-1",
      title: "Review client documentation",
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
      status: 'pending',
      priority: 'high'
    },
    {
      id: "template-2",
      title: "Schedule follow-up call",
      dueDate: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
      status: 'pending',
      priority: 'medium'
    },
    {
      id: "template-3",
      title: "Send welcome package",
      dueDate: new Date(Date.now() + 86400000 * 1).toISOString(), // 1 day from now
      status: 'pending',
      priority: 'medium'
    }
  ];
  
  const displayTasks = tasks.length > 0 ? tasks : templateTasks;

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Task Management</h3>
        <Button variant="ghost" size="sm" className="h-6 text-xs">+ Add Task</Button>
      </div>

      <ScrollArea className="pr-2">
        <div className="space-y-2">
          {displayTasks.length > 0 ? (
            displayTasks.map(task => (
              <Card key={task.id} className="p-2 text-sm">
                <div className="flex justify-between items-start">
                  <div className="font-medium text-xs">{task.title}</div>
                  <Badge className={`text-xs py-0 h-5 ${getTaskPriorityClass(task.priority)}`}>{task.priority}</Badge>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <CalendarClock className="h-3 w-3 mr-1" />
                    <span>{formatDate(task.dueDate)}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 text-green-600" 
                      onClick={() => handleCompleteTask(task.id)}
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Loading tasks...
            </div>
          )}
        </div>
      </ScrollArea>
    </>
  );
};
