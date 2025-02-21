
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskFilterProps {
  currentFilter: 'all' | 'pending' | 'completed';
  onFilterChange: (filter: 'all' | 'pending' | 'completed') => void;
}

export const TaskFilter = ({ currentFilter, onFilterChange }: TaskFilterProps) => {
  return (
    <div className="flex items-center gap-2">
      <Filter className="h-4 w-4 text-muted-foreground" />
      <div className="flex items-center gap-1">
        <Button
          variant={currentFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange('all')}
        >
          All
        </Button>
        <Button
          variant={currentFilter === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange('pending')}
        >
          Active
        </Button>
        <Button
          variant={currentFilter === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange('completed')}
        >
          Completed
        </Button>
      </div>
    </div>
  );
};
