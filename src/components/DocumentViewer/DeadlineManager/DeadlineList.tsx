
import React from 'react';
import { Deadline } from '../types';
import { DeadlineItem } from './DeadlineItem';
import { DeadlineListProps } from './types';

export const DeadlineList: React.FC<DeadlineListProps> = ({ 
  deadlines, 
  onRemove, 
  onStatusChange, 
  onEdit, 
  onDelete 
}) => {
  if (!deadlines || deadlines.length === 0) {
    return <div className="text-sm text-muted-foreground p-2">No deadlines set</div>;
  }

  return (
    <div>
      {deadlines.map((deadline) => (
        <DeadlineItem 
          key={deadline.id} 
          deadline={deadline} 
          onRemove={() => onRemove(deadline.id)}
          onStatusChange={onStatusChange}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
