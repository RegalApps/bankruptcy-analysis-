
import { supabase } from "@/lib/supabase";
import { Task } from "../../types";

// Get all tasks for a specific document
export const getTasks = async (documentId: string): Promise<Task[]> => {
  try {
    // In a real app, this would fetch from Supabase
    // For now, return mock data from localStorage
    const savedTasks = localStorage.getItem(`tasks-${documentId}`);
    if (savedTasks) {
      return JSON.parse(savedTasks);
    }
    return [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

// Create a new task
export const saveTask = async (task: Task): Promise<Task> => {
  try {
    // In a real app, this would save to Supabase
    // For now, save to localStorage
    const tasks = await getTasks(task.document_id);
    const updatedTasks = [...tasks, task];
    localStorage.setItem(`tasks-${task.document_id}`, JSON.stringify(updatedTasks));
    return task;
  } catch (error) {
    console.error("Error saving task:", error);
    throw error;
  }
};

// Update a task
export const updateTask = async (task: Task): Promise<Task> => {
  try {
    // In a real app, this would update in Supabase
    // For now, update in localStorage
    const tasks = await getTasks(task.document_id);
    const updatedTasks = tasks.map(t => t.id === task.id ? task : t);
    localStorage.setItem(`tasks-${task.document_id}`, JSON.stringify(updatedTasks));
    return task;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    // We need to find which document this task belongs to
    // In a real app with Supabase, we would just delete by ID
    // For localStorage, we need to search all documents
    
    // This is a workaround for localStorage implementation
    const allKeys = Object.keys(localStorage);
    const taskKeys = allKeys.filter(key => key.startsWith('tasks-'));
    
    for (const key of taskKeys) {
      const tasks: Task[] = JSON.parse(localStorage.getItem(key) || '[]');
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      
      if (taskIndex >= 0) {
        tasks.splice(taskIndex, 1);
        localStorage.setItem(key, JSON.stringify(tasks));
        break;
      }
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};
