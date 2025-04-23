import * as React from "react";
import { useState } from "react";
import { Circle, CheckCircle2, AlertTriangle, AlertOctagon, Bell } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createTask } from "./services/taskService";

interface TaskCreationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  availableUsers: Array<{
    id: string;
    full_name: string | null;
    email: string;
  }>;
  onTaskCreated: () => void;
}

export const TaskCreationDialog: React.FC<TaskCreationDialogProps> = ({
  isOpen,
  onClose,
  documentId,
  availableUsers,
  onTaskCreated,
}) => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [severity, setSeverity] = useState<"low" | "medium" | "high">("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Calculate due date based on severity
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + (severity === 'high' ? 2 : severity === 'medium' ? 5 : 7));

      // Create a mock user ID for local implementation
      const currentUserId = localStorage.getItem('current_user_id') || `user-${Date.now()}`;
      
      // Store the user ID for future use
      if (!localStorage.getItem('current_user_id')) {
        localStorage.setItem('current_user_id', currentUserId);
      }

      // Create the task using our local storage service
      await createTask(documentId, {
        title,
        description,
        severity,
        document_id: documentId,
        created_by: currentUserId,
        assigned_to: assignedTo,
        due_date: dueDate.toISOString(),
        status: 'pending'
      });

      toast({
        title: "Task Created",
        description: `Task "${title}" has been created and assigned.`,
      });

      onTaskCreated();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create task. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setAssignedTo("");
    setSeverity("medium");
  };

  const getSeverityIcon = (value: string) => {
    switch (value) {
      case "high":
        return <AlertOctagon className="h-4 w-4 text-red-500" />;
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "low":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Create New Task
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="severity">Priority</Label>
            <Select value={severity} onValueChange={(value: "low" | "medium" | "high") => setSeverity(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low" className="flex items-center gap-2">
                  <span className="flex items-center gap-2">
                    {getSeverityIcon("low")} Low Priority
                  </span>
                </SelectItem>
                <SelectItem value="medium" className="flex items-center gap-2">
                  <span className="flex items-center gap-2">
                    {getSeverityIcon("medium")} Medium Priority
                  </span>
                </SelectItem>
                <SelectItem value="high" className="flex items-center gap-2">
                  <span className="flex items-center gap-2">
                    {getSeverityIcon("high")} High Priority
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignee">Assign To</Label>
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                {availableUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.full_name || user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
