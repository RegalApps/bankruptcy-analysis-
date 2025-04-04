
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";

export interface TaskFilterProps {
  onStatusChange: Dispatch<SetStateAction<string | null>>;
  onSeverityChange: Dispatch<SetStateAction<string | null>>;
  selectedStatus: string | null;
  selectedSeverity: string | null;
}

export const TaskFilter = ({ 
  onStatusChange, 
  onSeverityChange, 
  selectedStatus, 
  selectedSeverity 
}: TaskFilterProps) => {
  return (
    <div className="flex flex-col space-y-2 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter by Status</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs h-7"
          onClick={() => {
            onStatusChange(null);
            onSeverityChange(null);
          }}
          disabled={!selectedStatus && !selectedSeverity}
        >
          Clear All
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-1">
        <Button
          variant={selectedStatus === 'pending' ? 'default' : 'outline'}
          size="sm"
          className="text-xs h-7"
          onClick={() => onStatusChange(selectedStatus === 'pending' ? null : 'pending')}
        >
          Pending
        </Button>
        <Button
          variant={selectedStatus === 'in_progress' ? 'default' : 'outline'}
          size="sm"
          className="text-xs h-7"
          onClick={() => onStatusChange(selectedStatus === 'in_progress' ? null : 'in_progress')}
        >
          In Progress
        </Button>
        <Button
          variant={selectedStatus === 'completed' ? 'default' : 'outline'}
          size="sm"
          className="text-xs h-7"
          onClick={() => onStatusChange(selectedStatus === 'completed' ? null : 'completed')}
        >
          Completed
        </Button>
        <Button
          variant={selectedStatus === 'cancelled' ? 'default' : 'outline'}
          size="sm"
          className="text-xs h-7"
          onClick={() => onStatusChange(selectedStatus === 'cancelled' ? null : 'cancelled')}
        >
          Cancelled
        </Button>
      </div>
      
      <div className="flex items-center">
        <span className="text-sm font-medium">Filter by Priority</span>
      </div>
      
      <div className="flex flex-wrap gap-1">
        <Button
          variant={selectedSeverity === 'high' ? 'default' : 'outline'}
          size="sm"
          className="text-xs h-7"
          onClick={() => onSeverityChange(selectedSeverity === 'high' ? null : 'high')}
        >
          High
        </Button>
        <Button
          variant={selectedSeverity === 'medium' ? 'default' : 'outline'}
          size="sm"
          className="text-xs h-7"
          onClick={() => onSeverityChange(selectedSeverity === 'medium' ? null : 'medium')}
        >
          Medium
        </Button>
        <Button
          variant={selectedSeverity === 'low' ? 'default' : 'outline'}
          size="sm"
          className="text-xs h-7"
          onClick={() => onSeverityChange(selectedSeverity === 'low' ? null : 'low')}
        >
          Low
        </Button>
      </div>
    </div>
  );
};
