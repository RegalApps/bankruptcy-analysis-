
import { CheckCircle } from "lucide-react";

interface EmptyStateProps {
  filter: 'all' | 'pending' | 'completed';
}

export const EmptyState = ({ filter }: EmptyStateProps) => {
  return (
    <div className="text-center p-6 border rounded-lg bg-muted/10">
      <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
      <p className="text-sm text-muted-foreground">
        {filter === 'all' 
          ? 'No tasks found'
          : filter === 'pending' 
          ? 'No active tasks'
          : 'No completed tasks'}
      </p>
    </div>
  );
};
