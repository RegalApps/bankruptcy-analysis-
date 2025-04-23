import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { Task } from "../../types";
import { getDocumentTasks } from "../services/taskService";

interface UseTaskManagerProps {
  documentId: string;
  initialTasks: Task[];
  onTaskUpdate: () => void;
}

export const useTaskManager = ({ documentId, initialTasks, onTaskUpdate }: UseTaskManagerProps) => {
  const { toast } = useToast();
  const [localTasks, setLocalTasks] = useState<Task[]>(initialTasks);

  const fetchTasks = async () => {
    try {
      console.log('Fetching tasks for document:', documentId);
      
      // Use our local storage service to get tasks
      const tasks = await getDocumentTasks(documentId);
      
      console.log('Fetched tasks:', tasks);
      setLocalTasks(tasks || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch tasks"
      });
    }
  };

  useEffect(() => {
    console.log('Setting up local task manager for document:', documentId);
    fetchTasks();

    // Set up a simple event listener for storage changes
    // This will allow us to update tasks if they're modified in another tab
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'local_tasks') {
        console.log('Local tasks storage changed, refreshing tasks');
        fetchTasks();
        onTaskUpdate();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      console.log('Cleaning up local task manager');
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [documentId, onTaskUpdate]);

  return { localTasks };
};
