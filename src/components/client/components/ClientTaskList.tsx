
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface Task {
  id: string;
  title: string;
  due_date?: string;
  status: string;
  priority: string;
}

interface ClientTaskListProps {
  clientId: string;
  limit?: number;
}

export const ClientTaskList = ({ clientId, limit }: ClientTaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now using mock data
    const mockTasks = [
      {
        id: '1',
        title: 'Review consumer proposal documents',
        due_date: new Date().toISOString(),
        status: 'pending',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Schedule follow-up meeting',
        due_date: new Date(Date.now() + 86400000 * 3).toISOString(),
        status: 'pending',
        priority: 'medium'
      },
      {
        id: '3',
        title: 'Upload signed Form 47',
        due_date: new Date(Date.now() - 86400000 * 2).toISOString(),
        status: 'completed',
        priority: 'high'
      },
      {
        id: '4',
        title: 'Send financial summary report',
        due_date: new Date(Date.now() + 86400000 * 7).toISOString(),
        status: 'pending',
        priority: 'low'
      },
    ];
    
    setTasks(mockTasks);
    setLoading(false);
  }, [clientId]);
  
  const getTaskIcon = (task: Task) => {
    if (task.status === 'completed') return <CheckCircle className="h-4 w-4 text-green-500" />;
    
    if (task.priority === 'high') {
      if (new Date(task.due_date || '') < new Date()) {
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      }
      return <Clock className="h-4 w-4 text-amber-500" />;
    }
    
    return <Clock className="h-4 w-4 text-muted-foreground" />;
  };
  
  const handleCompleteTask = (taskId: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' } 
          : task
      )
    );
  };
  
  const visibleTasks = limit ? tasks.slice(0, limit) : tasks;
  
  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading tasks...</div>;
  }
  
  if (tasks.length === 0) {
    return <div className="text-sm text-muted-foreground">No tasks assigned</div>;
  }
  
  return (
    <div className="space-y-3">
      {visibleTasks.map(task => (
        <div key={task.id} className="flex items-start text-sm p-2 rounded-md bg-muted/50">
          <div className="mt-1 mr-3">
            {getTaskIcon(task)}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </p>
            {task.due_date && (
              <p className="text-xs text-muted-foreground">
                Due: {format(new Date(task.due_date), 'MMM d, yyyy')}
              </p>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2"
            onClick={() => handleCompleteTask(task.id)}
          >
            {task.status === 'completed' ? 'Undo' : 'Complete'}
          </Button>
        </div>
      ))}
    </div>
  );
};
