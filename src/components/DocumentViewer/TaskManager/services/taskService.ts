import type { Task } from "../../types";

// Local task storage
const getLocalTasks = (): Record<string, Task[]> => {
  try {
    const storedTasks = localStorage.getItem('local_tasks');
    return storedTasks ? JSON.parse(storedTasks) : {};
  } catch (e) {
    console.error("Error getting local tasks:", e);
    return {};
  }
};

// Save tasks to local storage
const saveLocalTasks = (tasks: Record<string, Task[]>) => {
  try {
    localStorage.setItem('local_tasks', JSON.stringify(tasks));
  } catch (e) {
    console.error("Error saving local tasks:", e);
  }
};

export const updateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
  try {
    const allTasks = getLocalTasks();
    
    // Find the document that contains this task
    let updated = false;
    
    Object.keys(allTasks).forEach(documentId => {
      const documentTasks = allTasks[documentId];
      const taskIndex = documentTasks.findIndex(task => task.id === taskId);
      
      if (taskIndex !== -1) {
        // Update the task status
        documentTasks[taskIndex].status = newStatus;
        allTasks[documentId] = documentTasks;
        updated = true;
      }
    });
    
    if (!updated) {
      throw new Error("Task not found");
    }
    
    // Save updated tasks
    saveLocalTasks(allTasks);
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
};

export const assignTask = async (taskId: string, userId: string) => {
  try {
    const allTasks = getLocalTasks();
    
    // Find the document that contains this task
    let updated = false;
    
    Object.keys(allTasks).forEach(documentId => {
      const documentTasks = allTasks[documentId];
      const taskIndex = documentTasks.findIndex(task => task.id === taskId);
      
      if (taskIndex !== -1) {
        // Update the assigned user
        documentTasks[taskIndex].assigned_to = userId;
        allTasks[documentId] = documentTasks;
        updated = true;
      }
    });
    
    if (!updated) {
      throw new Error("Task not found");
    }
    
    // Save updated tasks
    saveLocalTasks(allTasks);
  } catch (error) {
    console.error("Error assigning task:", error);
    throw error;
  }
};

export const createTask = async (documentId: string, task: Omit<Task, 'id'>) => {
  try {
    const allTasks = getLocalTasks();
    
    // Create a new task with a random ID
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    };
    
    // Add to document tasks
    if (!allTasks[documentId]) {
      allTasks[documentId] = [];
    }
    
    allTasks[documentId].push(newTask);
    
    // Save updated tasks
    saveLocalTasks(allTasks);
    
    return newTask;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const getDocumentTasks = async (documentId: string): Promise<Task[]> => {
  try {
    const allTasks = getLocalTasks();
    return allTasks[documentId] || [];
  } catch (error) {
    console.error("Error getting document tasks:", error);
    return [];
  }
};
