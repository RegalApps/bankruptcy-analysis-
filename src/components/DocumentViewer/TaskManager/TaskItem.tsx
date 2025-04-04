
import React, { useState } from "react";
import { format } from "date-fns";
import { 
  AlertTriangle, 
  Clock, 
  MoreVertical, 
  Check, 
  XCircle, 
  Play, 
  Trash2,
  Info,
  CheckCircle2
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Task } from "../types";

interface TaskItemProps {
  task: Task;
  onStatusChange: (status: Task['status']) => void;
  onDelete: () => void;
  isHighlighted?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onStatusChange, onDelete, isHighlighted = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getStatusColor = () => {
    switch (task.status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };

  const getSeverityIcon = () => {
    switch (task.severity) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Info className="h-4 w-4 text-amber-500" />;
      case 'low':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusActions = () => {
    switch (task.status) {
      case 'pending':
        return [
          { label: 'Start Task', status: 'in_progress', icon: <Play className="h-4 w-4 mr-2" /> },
          { label: 'Mark Completed', status: 'completed', icon: <Check className="h-4 w-4 mr-2" /> },
          { label: 'Cancel Task', status: 'cancelled', icon: <XCircle className="h-4 w-4 mr-2" /> }
        ];
      case 'in_progress':
        return [
          { label: 'Mark Completed', status: 'completed', icon: <Check className="h-4 w-4 mr-2" /> },
          { label: 'Move to Pending', status: 'pending', icon: <Clock className="h-4 w-4 mr-2" /> },
          { label: 'Cancel Task', status: 'cancelled', icon: <XCircle className="h-4 w-4 mr-2" /> }
        ];
      case 'completed':
        return [
          { label: 'Reopen Task', status: 'pending', icon: <Clock className="h-4 w-4 mr-2" /> }
        ];
      case 'cancelled':
        return [
          { label: 'Reopen Task', status: 'pending', icon: <Clock className="h-4 w-4 mr-2" /> }
        ];
      default:
        return [];
    }
  };

  return (
    <div 
      className={`p-3 rounded-md border transition-all ${
        isHighlighted 
          ? 'bg-primary/5 border-primary/40 shadow-sm ring-1 ring-primary/20' 
          : 'bg-muted/10 hover:bg-muted/20'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getSeverityIcon()}
          <h4 className="font-medium text-sm">{task.title}</h4>
        </div>
        
        <div className="flex items-center">
          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor()}`}>
            {task.status === 'in_progress' ? 'In Progress' : 
             task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {getStatusActions().map((action) => (
                <DropdownMenuItem
                  key={action.status}
                  onClick={() => onStatusChange(action.status as Task['status'])}
                >
                  {action.icon}
                  {action.label}
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onDelete}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {task.description && (
        <div className="mt-2">
          <button 
            className="text-xs text-primary hover:underline"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Hide details' : 'Show details'}
          </button>
          
          {isExpanded && (
            <p className="text-xs mt-1 text-muted-foreground">
              {task.description}
            </p>
          )}
        </div>
      )}
      
      <div className="flex items-center justify-between mt-2 pt-2 text-xs text-muted-foreground">
        {task.due_date && (
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            Due: {format(new Date(task.due_date), 'MMM d, yyyy')}
          </div>
        )}
        
        {task.created_at && (
          <div>
            Added: {format(new Date(task.created_at), 'MMM d, yyyy')}
          </div>
        )}
      </div>
    </div>
  );
};
