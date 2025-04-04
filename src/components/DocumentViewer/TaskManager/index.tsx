
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Task } from "../types";
import { TaskItem } from "./TaskItem";
import { useTaskManager } from "./hooks/useTaskManager";
import { AddTaskDialog } from "./components/AddTaskDialog";

interface TaskManagerProps {
  documentId: string;
  tasks: Task[];
  onTaskUpdate: () => void;
  activeRiskId?: string | null;
  onRiskSelect?: (riskId: string | null) => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  documentId,
  tasks,
  onTaskUpdate,
  activeRiskId,
  onRiskSelect
}) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const { addTask, updateTaskStatus, deleteTask, loading } = useTaskManager(documentId);

  const handleAddTask = async (task: Omit<Task, 'id' | 'document_id'>) => {
    await addTask(task);
    setIsAddingTask(false);
    onTaskUpdate();
  };

  const handleStatusUpdate = async (taskId: string, status: Task['status']) => {
    await updateTaskStatus(taskId, status);
    onTaskUpdate();
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
    onTaskUpdate();
  };

  const isTaskFromActiveRisk = (task: Task) => {
    if (!activeRiskId) return false;
    
    // Extract risk type from activeRiskId (e.g., "risk-2-Missing Administrator Certificate")
    const parts = activeRiskId.split('-');
    if (parts.length < 3) return false;
    
    // Join all parts after the index to get the full risk type
    const riskType = parts.slice(2).join('-');
    
    // Check if task title or description contains the risk type
    return task.title.includes(riskType) || 
           (task.description && task.description.includes(riskType));
  };

  // If there's an active risk but no task for it, we should suggest creating one
  const shouldSuggestTaskCreation = activeRiskId && !tasks.some(isTaskFromActiveRisk);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium">Tasks</h3>
        <Button 
          onClick={() => setIsAddingTask(true)} 
          variant="ghost" 
          size="sm" 
          className="flex items-center text-xs gap-1"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Task
        </Button>
      </div>
      
      {shouldSuggestTaskCreation && (
        <div className="p-3 border border-dashed border-primary/40 bg-primary/5 rounded-md">
          <p className="text-sm font-medium">Create a task for this issue?</p>
          <p className="text-xs text-muted-foreground mb-3">
            You've selected an issue that doesn't have an associated task yet.
          </p>
          <Button 
            size="sm" 
            onClick={() => setIsAddingTask(true)}
            className="w-full text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Create Task from Selected Issue
          </Button>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="text-center p-6 border rounded-md bg-muted/10">
          <p className="text-sm text-muted-foreground">No tasks yet</p>
          <Button 
            onClick={() => setIsAddingTask(true)}
            variant="outline" 
            size="sm"
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-1" />
            Create First Task
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onStatusChange={(status) => handleStatusUpdate(task.id, status)}
              onDelete={() => handleDeleteTask(task.id)}
              isHighlighted={isTaskFromActiveRisk(task)}
            />
          ))}
        </div>
      )}

      <AddTaskDialog
        isOpen={isAddingTask}
        onClose={() => setIsAddingTask(false)}
        onAdd={handleAddTask}
        selectedRiskId={activeRiskId}
        documentId={documentId}
      />
    </div>
  );
};
