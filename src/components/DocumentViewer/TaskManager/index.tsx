
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { Task } from "../types";
import { TaskItem } from "./TaskItem";
import { EmptyState } from "./EmptyState";
import { TaskCreationDialog } from "./TaskCreationDialog";
import { TaskHeader } from "./components/TaskHeader";
import { useTaskManager } from "./hooks/useTaskManager";
import { useAvailableUsers } from "./hooks/useAvailableUsers";
import { updateTaskStatus, assignTask } from "./services/taskService";

interface TaskManagerProps {
  documentId: string;
  tasks: Task[];
  onTaskUpdate: () => void;
}

export const TaskManager = ({ documentId, tasks: initialTasks, onTaskUpdate }: TaskManagerProps) => {
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  
  const { localTasks } = useTaskManager({ documentId, initialTasks, onTaskUpdate });
  const { availableUsers } = useAvailableUsers();

  const handleUpdateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      toast({
        title: "Task Updated",
        description: `Task status changed to ${newStatus}`,
      });
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
      await assignTask(taskId, userId);
      toast({
        title: "Task Assigned",
        description: "Task has been assigned successfully",
      });
    } catch (error) {
      console.error('Error assigning task:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assign task"
      });
    }
  };

  const filteredTasks = localTasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'pending') return ['pending', 'in_progress'].includes(task.status);
    return task.status === 'completed';
  });

  return (
    <div className="space-y-4">
      <TaskHeader 
        filter={filter}
        onFilterChange={setFilter}
        onCreateTask={() => setIsCreatingTask(true)}
      />

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
