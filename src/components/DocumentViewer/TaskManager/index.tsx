
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import type { Task } from "../types";
import { TaskItem } from "./TaskItem";
import { TaskFilter } from "./TaskFilter";
import { EmptyState } from "./EmptyState";

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
        <TaskFilter currentFilter={filter} onFilterChange={setFilter} />
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
    </div>
  );
};
