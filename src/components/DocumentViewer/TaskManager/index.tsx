
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { 
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  Clock,
  CheckCircle2,
  XCircle,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface Task {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date: string;
  created_at: string;
  created_by: string;
  assigned_to?: string;
  document_id: string;
  regulation?: string;
  solution?: string;
}

interface TaskManagerProps {
  documentId: string;
  tasks: Task[];
  onTaskUpdate: () => void;
}

export const TaskManager = ({ documentId, tasks, onTaskUpdate }: TaskManagerProps) => {
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'high':
        return <AlertOctagon className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: "Task Updated",
        description: `Task status changed to ${newStatus}`,
      });

      onTaskUpdate();
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update task status"
      });
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'pending') return ['pending', 'in_progress'].includes(task.status);
    return task.status === 'completed';
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Tasks</h3>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <div className="flex items-center gap-1">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('pending')}
            >
              Active
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('completed')}
            >
              Completed
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">
                    {getSeverityIcon(task.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-medium truncate">{task.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Due: {format(new Date(task.due_date), 'MMM d')}
                        </span>
                        {getStatusIcon(task.status)}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                      {task.description}
                    </p>
                    {task.regulation && (
                      <p className="text-sm text-muted-foreground mt-2">
                        <span className="font-medium">Regulation:</span> {task.regulation}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                {task.status !== 'completed' && task.status !== 'cancelled' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateTaskStatus(task.id, 'cancelled')}
                    >
                      Cancel
                    </Button>
                    {task.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateTaskStatus(task.id, 'in_progress')}
                      >
                        Start
                      </Button>
                    )}
                    {task.status === 'in_progress' && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                      >
                        Complete
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-6 border rounded-lg bg-muted/10">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {filter === 'all' 
                ? 'No tasks found'
                : filter === 'pending' 
                ? 'No active tasks'
                : 'No completed tasks'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
