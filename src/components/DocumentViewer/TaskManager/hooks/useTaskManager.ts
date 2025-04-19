
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import type { Task } from "../../types";

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
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('document_id', documentId);

      if (error) throw error;

      console.log('Fetched tasks:', data);
      setLocalTasks(data || []);
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
    console.log('Setting up real-time subscription for document:', documentId);
    fetchTasks();

    const channel = supabase
      .channel('tasks_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `document_id=eq.${documentId}`
        },
        async (payload) => {
          console.log('Task change detected:', payload);
          await fetchTasks();
          onTaskUpdate();
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [documentId, onTaskUpdate]);

  return { localTasks };
};
