
import React from 'react';
import { Deadline } from '../types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2, CheckCircle } from 'lucide-react';

interface DeadlineItemProps {
  deadline: Deadline;
  onRemove: (id: string) => void;
  onStatusChange: (id: string, status: 'pending' | 'completed' | 'overdue') => void;
  onEdit: (deadline: Deadline) => void;
  onDelete: (id: string) => void;
}

export const DeadlineItem: React.FC<DeadlineItemProps> = ({ 
  deadline, 
  onRemove, 
  onStatusChange, 
  onEdit,
  onDelete
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="border rounded-md p-3 mb-2">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-medium text-sm">{deadline.title}</h4>
          {deadline.description && (
            <p className="text-xs text-muted-foreground">{deadline.description}</p>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <Badge variant="outline" className={getPriorityColor(deadline.priority)}>
            {deadline.priority}
          </Badge>
          <Badge variant="outline" className={getStatusColor(deadline.status)}>
            {deadline.status}
          </Badge>
        </div>
      </div>
      
      <div className="flex justify-between items-center text-xs">
        <div className="text-muted-foreground">
          Due: {formatDate(deadline.due_date)}
        </div>
        <div className="flex space-x-1">
          {deadline.status !== 'completed' && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => onStatusChange(deadline.id, 'completed')}
            >
              <CheckCircle className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Complete</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={() => onEdit(deadline)}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onDelete(deadline.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
