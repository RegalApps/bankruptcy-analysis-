
import React from 'react';
import { DeadlineListProps } from './types';
import { DeadlineItem } from './DeadlineItem';

export const DeadlineList: React.FC<DeadlineListProps> = ({ deadlines, onRemove }) => {
  if (!deadlines?.length) {
    return <p className="text-sm text-muted-foreground">No deadlines set</p>;
  }

  return (
    <div className="space-y-2">
      {deadlines.map((deadline, index) => (
        <DeadlineItem
          key={index}
          deadline={deadline}
          onRemove={() => onRemove(index)}
        />
      ))}
    </div>
  );
};
