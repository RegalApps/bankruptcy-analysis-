
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import type { Task } from "../types";
import { TaskItem } from "./TaskItem";
import { TaskFilter } from "./TaskFilter";
import { EmptyState } from "./EmptyState";
import { TaskCreationDialog } from "./TaskCreationDialog";
import { Button } from "@/components/ui/button";

interface TaskManagerProps {
  documentId: string;
  tasks: Task[];
  onTaskUpdate: () => void;
}

interface AvailableUser {
  id: string;
  full_name: string | null;
  email: string;
}

export const TaskManager = ({ documentId, tasks, onTaskUpdate }: TaskManagerProps) => {
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([]);
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  useEffect(() => {
    fetchAvailableUsers();
  }, []);

  const fetchAvailableUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('available_users')
        .select('*');

      if (error) throw error;
      setAvailableUsers(data || []);
    } catch (error) {
      console.error('Error fetching available users:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch available users"
      });
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

  const handleAssignTask = async (taskId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ assigned_to: userId })
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: "Task Assigned",
        description: "Task has been assigned successfully",
      });

      onTaskUpdate();
    } catch (error) {
      console.error('Error assigning task:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assign task"
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
          <TaskFilter currentFilter={filter} onFilterChange={setFilter} />
          <Button
            size="sm"
            onClick={() => setIsCreatingTask(true)}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              availableUsers={availableUsers}
              onUpdateStatus={handleUpdateTaskStatus}
              onAssignTask={handleAssignTask}
            />
          ))
        ) : (
          <EmptyState filter={filter} />
        )}
      </div>

      <TaskCreationDialog 
        isOpen={isCreatingTask}
        onClose={() => setIsCreatingTask(false)}
        documentId={documentId}
        availableUsers={availableUsers}
        onTaskCreated={onTaskUpdate}
      />
    </div>
  );
};
