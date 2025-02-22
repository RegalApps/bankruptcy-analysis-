
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { TaskFilter } from "../TaskFilter";

interface TaskHeaderProps {
  filter: 'all' | 'pending' | 'completed';
  onFilterChange: (filter: 'all' | 'pending' | 'completed') => void;
  onCreateTask: () => void;
}

export const TaskHeader = ({ filter, onFilterChange, onCreateTask }: TaskHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-medium">Tasks</h3>
      <div className="flex items-center gap-2">
        <TaskFilter currentFilter={filter} onFilterChange={onFilterChange} />
        <Button
          size="sm"
          onClick={onCreateTask}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>
    </div>
  );
};
