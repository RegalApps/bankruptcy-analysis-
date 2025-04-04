
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Filter } from 'lucide-react';

interface TaskHeaderProps {
  onFilterClick: () => void;
  isFilterOpen: boolean;
  totalTasks: number;
  completedTasks: number;
}

export const TaskHeader: React.FC<TaskHeaderProps> = ({ 
  onFilterClick, 
  isFilterOpen,
  totalTasks,
  completedTasks 
}) => {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium">Tasks</div>
        {totalTasks > 0 && (
          <div className="flex items-center space-x-3 text-xs text-muted-foreground">
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {totalTasks} Total
            </span>
            <span className="flex items-center">
              <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
              {completedTasks} Completed
            </span>
          </div>
        )}
      </div>
      
      <Button 
        variant={isFilterOpen ? "secondary" : "ghost"} 
        size="sm" 
        onClick={onFilterClick}
        className="flex items-center gap-1"
      >
        <Filter className="h-3.5 w-3.5" />
        <span className="text-xs">Filter</span>
      </Button>
    </div>
  );
};
