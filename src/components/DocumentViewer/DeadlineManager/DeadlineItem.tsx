
import React from 'react';
import { X } from 'lucide-react';
import { DeadlineItemProps } from './types';

export const DeadlineItem: React.FC<DeadlineItemProps> = ({ deadline, onRemove }) => {
  return (
    <div className="flex items-start justify-between p-2 bg-background rounded-md">
      <div>
        <p className="font-medium text-sm">{deadline.title}</p>
        <p className="text-xs text-muted-foreground">
          Due: {new Date(deadline.due_date).toLocaleString()}
        </p>
        {deadline.description && (
          <p className="text-xs text-muted-foreground mt-1">{deadline.description}</p>
        )}
      </div>
      <button
        onClick={onRemove}
        className="text-muted-foreground hover:text-destructive"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
