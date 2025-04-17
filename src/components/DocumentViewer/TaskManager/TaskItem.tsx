
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Edit, 
  MoreVertical, 
  PlayCircle, 
  Trash2, 
  XCircle 
} from "lucide-react";
import { Task } from "../types";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface TaskItemProps {
  task: Task;
  onStatusChange: (newStatus: 'pending' | 'in_progress' | 'completed' | 'cancelled') => void;
  onEdit: () => void;
  onDelete: () => void;
  isHighlighted?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onStatusChange,
  onEdit,
  onDelete,
  isHighlighted = false
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-amber-500 bg-amber-50 border-amber-200';
      case 'in_progress':
        return 'text-blue-500 bg-blue-50 border-blue-200';
      case 'completed':
        return 'text-green-500 bg-green-50 border-green-200';
      case 'cancelled':
        return 'text-gray-500 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'in_progress':
        return <PlayCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getSeverityIcon = (severity: string | undefined) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'low':
        return <AlertTriangle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card 
      className={`p-4 transition-all ${
        isHighlighted 
          ? 'ring-2 ring-primary border-primary/30 shadow-md' 
          : 'hover:shadow-sm'
      }`}
    >
      <div className="flex justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {getSeverityIcon(task.severity)}
            <h3 className="font-medium text-sm line-clamp-1">
              {task.title}
            </h3>
          </div>
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <Badge variant="outline" className={`${getStatusColor(task.status)} flex items-center gap-1`}>
            {getStatusIcon(task.status)} {task.status.replace('_', ' ')}
          </Badge>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Task
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {task.status !== 'pending' && (
                <DropdownMenuItem onClick={() => onStatusChange('pending')}>
                  <Clock className="h-4 w-4 mr-2 text-amber-500" />
                  Mark as Pending
                </DropdownMenuItem>
              )}
              
              {task.status !== 'in_progress' && (
                <DropdownMenuItem onClick={() => onStatusChange('in_progress')}>
                  <PlayCircle className="h-4 w-4 mr-2 text-blue-500" />
                  Mark as In Progress
                </DropdownMenuItem>
              )}
              
              {task.status !== 'completed' && (
                <DropdownMenuItem onClick={() => onStatusChange('completed')}>
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Mark as Completed
                </DropdownMenuItem>
              )}
              
              {task.status !== 'cancelled' && (
                <DropdownMenuItem onClick={() => onStatusChange('cancelled')}>
                  <XCircle className="h-4 w-4 mr-2 text-gray-500" />
                  Mark as Cancelled
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="text-red-600" onClick={onDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {task.due_date && (
        <div className="flex items-center mt-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5 mr-1" />
          Due: {new Date(task.due_date).toLocaleDateString()}
        </div>
      )}
    </Card>
  );
};
