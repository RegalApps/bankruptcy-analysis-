
import { format } from "date-fns";
import { 
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  Clock,
  CheckCircle2,
  XCircle,
  UserCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import type { Task } from "../types";

interface AvailableUser {
  id: string;
  full_name: string | null;
  email: string;
}

interface TaskItemProps {
  task: Task;
  availableUsers: AvailableUser[];
  onUpdateStatus: (taskId: string, newStatus: Task['status']) => void;
  onAssignTask: (taskId: string, userId: string) => void;
}

export const TaskItem = ({ task, availableUsers, onUpdateStatus, onAssignTask }: TaskItemProps) => {
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'high':
        return <AlertOctagon className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const assignedUser = availableUsers.find(user => user.id === task.assigned_to);

  return (
    <>
      <div className="p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="mt-1">
              {getSeverityIcon(task.severity)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-medium truncate">{task.title}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Due: {format(new Date(task.due_date), 'MMM d')}
                  </span>
                  {getStatusIcon(task.status)}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                {task.description}
              </p>
              {task.regulation && (
                <p className="text-sm text-muted-foreground mt-2">
                  <span className="font-medium">Regulation:</span> {task.regulation}
                </p>
              )}
              <div className="mt-2 flex items-center gap-2">
                <UserCircle2 className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={task.assigned_to || ""}
                  onValueChange={(value) => onAssignTask(task.id, value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Assign to..." />
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
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          {task.status !== 'completed' && task.status !== 'cancelled' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateStatus(task.id, 'cancelled')}
              >
                Cancel
              </Button>
              {task.status === 'pending' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateStatus(task.id, 'in_progress')}
                >
                  Start
                </Button>
              )}
              {task.status === 'in_progress' && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setShowCompleteDialog(true)}
                >
                  Complete
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <AlertDialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this task as completed? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onUpdateStatus(task.id, 'completed');
                setShowCompleteDialog(false);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
