
import { useState } from 'react';
import { Calendar, Plus, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast";
import { DocumentDetails, Deadline } from './types';

interface DeadlineManagerProps {
  document: DocumentDetails;
  onDeadlineUpdated: () => void;
}

export const DeadlineManager: React.FC<DeadlineManagerProps> = ({ document, onDeadlineUpdated }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newDeadline, setNewDeadline] = useState<Deadline>({
    title: '',
    dueDate: '',
    description: ''
  });
  const { toast } = useToast();

  const handleAddDeadline = async () => {
    if (!newDeadline.title || !newDeadline.dueDate) {
      toast({
        variant: "destructive",
        title: "Invalid deadline",
        description: "Please provide both a title and due date"
      });
      return;
    }

    try {
      const currentDeadlines = document.deadlines || [];
      const { error } = await supabase
        .from('documents')
        .update({
          deadlines: [...currentDeadlines, newDeadline]
        })
        .eq('id', document.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Deadline added successfully"
      });

      setIsAdding(false);
      setNewDeadline({ title: '', dueDate: '', description: '' });
      onDeadlineUpdated();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add deadline"
      });
    }
  };

  const removeDeadline = async (index: number) => {
    try {
      const currentDeadlines = [...(document.deadlines || [])];
      currentDeadlines.splice(index, 1);

      const { error } = await supabase
        .from('documents')
        .update({
          deadlines: currentDeadlines
        })
        .eq('id', document.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Deadline removed successfully"
      });

      onDeadlineUpdated();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove deadline"
      });
    }
  };

  return (
    <div className="p-4 rounded-md bg-muted">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">Deadlines</h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="text-sm text-primary hover:underline flex items-center space-x-1"
        >
          <Plus className="h-4 w-4" />
          <span>Add</span>
        </button>
      </div>

      {isAdding && (
        <div className="space-y-3 mb-4 p-3 bg-background rounded-md">
          <input
            type="text"
            placeholder="Title"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={newDeadline.title}
            onChange={(e) => setNewDeadline({ ...newDeadline, title: e.target.value })}
          />
          <input
            type="datetime-local"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={newDeadline.dueDate}
            onChange={(e) => setNewDeadline({ ...newDeadline, dueDate: e.target.value })}
          />
          <textarea
            placeholder="Description (optional)"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={newDeadline.description}
            onChange={(e) => setNewDeadline({ ...newDeadline, description: e.target.value })}
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              onClick={handleAddDeadline}
              className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Add Deadline
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {document.deadlines?.length ? (
          document.deadlines.map((deadline: Deadline, index) => (
            <div key={index} className="flex items-start justify-between p-2 bg-background rounded-md">
              <div>
                <p className="font-medium text-sm">{deadline.title}</p>
                <p className="text-xs text-muted-foreground">
                  Due: {new Date(deadline.dueDate).toLocaleString()}
                </p>
                {deadline.description && (
                  <p className="text-xs text-muted-foreground mt-1">{deadline.description}</p>
                )}
              </div>
              <button
                onClick={() => removeDeadline(index)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No deadlines set</p>
        )}
      </div>
    </div>
  );
};
