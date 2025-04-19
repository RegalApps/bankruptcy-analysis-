
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Task } from '../../types';
import { saveTask, updateTask, deleteTask as apiDeleteTask, getTasks } from '../services/taskService';

export interface UseTaskManagerProps {
  documentId: string;
}

export interface UseTaskManagerReturn {
  localTasks: Task[];
  addTask: (task: Partial<Task>) => void;
  updateTaskStatus: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  loading: boolean;
  error: string | null;
}

export const useTaskManager = ({ documentId }: UseTaskManagerProps): UseTaskManagerReturn => {
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load tasks for this document
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const tasks = await getTasks(documentId);
        setLocalTasks(tasks);
        setError(null);
      } catch (err: any) {
        console.error('Error loading tasks:', err);
        setError(err.message || 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    
    loadTasks();
  }, [documentId]);
  
  // Add a new task
  const addTask = async (taskData: Partial<Task>) => {
    try {
      const newTask: Task = {
        id: uuidv4(),
        document_id: documentId,
        title: taskData.title || 'Untitled Task',
        description: taskData.description || '',
        status: taskData.status || 'pending',
        severity: taskData.severity || 'medium',
        created_at: new Date().toISOString(),
        due_date: taskData.due_date,
        assigned_to: taskData.assigned_to,
        regulation: taskData.regulation,
        solution: taskData.solution,
      };
      
      // Optimistic update
      setLocalTasks(prev => [...prev, newTask]);
      
      // Save to backend
      await saveTask(newTask);
      toast.success('Task added successfully');
    } catch (err: any) {
      console.error('Error adding task:', err);
      toast.error('Failed to add task');
      
      // Revert optimistic update
      setLocalTasks(prev => prev.filter(task => task.id !== taskData.id));
    }
  };
  
  // Update task status
  const updateTaskStatus = async (updatedTask: Task) => {
    try {
      // Optimistic update
      setLocalTasks(prev => 
        prev.map(task => task.id === updatedTask.id ? updatedTask : task)
      );
      
      // Save to backend
      await updateTask(updatedTask);
      toast.success('Task updated successfully');
    } catch (err: any) {
      console.error('Error updating task:', err);
      toast.error('Failed to update task');
      
      // Reload tasks to revert changes
      const tasks = await getTasks(documentId);
      setLocalTasks(tasks);
    }
  };
  
  // Delete task
  const deleteTask = async (taskId: string) => {
    try {
      // Optimistic update
      const taskToDelete = localTasks.find(task => task.id === taskId);
      setLocalTasks(prev => prev.filter(task => task.id !== taskId));
      
      // Delete from backend
      await apiDeleteTask(taskId);
      toast.success('Task deleted successfully');
    } catch (err: any) {
      console.error('Error deleting task:', err);
      toast.error('Failed to delete task');
      
      // Reload tasks to revert changes
      const tasks = await getTasks(documentId);
      setLocalTasks(tasks);
    }
  };
  
  return {
    localTasks,
    addTask,
    updateTaskStatus,
    deleteTask,
    loading,
    error
  };
};

export default useTaskManager;
