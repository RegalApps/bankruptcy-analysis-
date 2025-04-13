
import React from 'react';
import { Deadline } from '../types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, X, CheckCircle } from 'lucide-react';

export interface DeadlineItemProps {
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
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isOverdue = () => {
    const now = new Date();
    const dueDate = new Date(deadline.due_date);
    return deadline.status === 'pending' && dueDate < now;
  };

  const getStatusColor = () => {
    if (deadline.status === 'completed') return 'bg-green-100 text-green-800';
    if (deadline.status === 'overdue' || isOverdue()) return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const handleStatusToggle = () => {
    const newStatus = deadline.status === 'completed' ? 'pending' : 'completed';
    onStatusChange(deadline.id, newStatus);
  };

  return (
    <div className="border rounded-md p-3 bg-card">
      <div className="flex justify-between items-start gap-2 mb-2">
        <div>
          <h3 className="font-medium text-sm">{deadline.title}</h3>
          <p className="text-xs text-muted-foreground">Due: {formatDate(deadline.due_date)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={getStatusColor()}>
            {isOverdue() && deadline.status === 'pending' ? 'Overdue' : deadline.status}
          </Badge>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(deadline)} className="h-6 w-6">
              <Pencil className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(deadline.id)} className="h-6 w-6">
              <Trash2 className="h-3 w-3 text-destructive" />
            </Button>
          </div>
        </div>
      </div>
      {deadline.description && (
        <p className="text-xs mt-1">{deadline.description}</p>
      )}
      <div className="flex justify-end mt-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleStatusToggle}
          className="text-xs h-7 px-2"
        >
          {deadline.status === 'completed' ? (
            <>
              <X className="h-3 w-3 mr-1" />
              Mark as incomplete
            </>
          ) : (
            <>
              <CheckCircle className="h-3 w-3 mr-1" />
              Mark as complete
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
