
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Task } from "../types";
import { TaskItem } from "./TaskItem";
import { useTaskManager } from "./hooks/useTaskManager";
import AddTaskDialog from "./components/AddTaskDialog";
import { TaskFilter } from "./TaskFilter";

interface TaskManagerProps {
  documentId: string;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ documentId }) => {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);

  const { localTasks, addTask, updateTaskStatus, deleteTask, loading } = useTaskManager({ documentId });

  const handleOpenAddTask = () => {
    setEditingTask(null);
    setIsAddTaskOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsAddTaskOpen(true);
  };

  const handleSaveTask = (task: Partial<Task>) => {
    if (editingTask) {
      updateTaskStatus({ ...editingTask, ...task });
    } else {
      addTask(task);
    }
  };

  const filteredTasks = localTasks.filter(task => {
    if (filterStatus && task.status !== filterStatus) {
      return false;
    }
    if (filterSeverity && task.severity !== filterSeverity) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <Button onClick={handleOpenAddTask} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add Task
        </Button>
      </div>
      
      <TaskFilter 
        onStatusChange={setFilterStatus} 
        onSeverityChange={setFilterSeverity}
        selectedStatus={filterStatus}
        selectedSeverity={filterSeverity} 
      />
      
      <ScrollArea className="h-[calc(100vh-280px)]">
        {loading ? (
          <div className="py-8 text-center">
            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="py-8 text-center border rounded-md">
            <p className="text-sm text-muted-foreground">
              {filterStatus || filterSeverity ? "No tasks match your filters" : "No tasks yet"}
            </p>
            {(filterStatus || filterSeverity) && (
              <Button 
                variant="link" 
                onClick={() => { 
                  setFilterStatus(null);
                  setFilterSeverity(null);
                }}
                className="text-sm"
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task}
                onStatusChange={(newStatus) => updateTaskStatus({ ...task, status: newStatus })}
                onEdit={() => handleEditTask(task)}
                onDelete={() => deleteTask(task.id)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
      
      <AddTaskDialog
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onSave={handleSaveTask}
        initialTask={editingTask || {}}
        documentId={documentId}
      />
    </div>
  );
};
