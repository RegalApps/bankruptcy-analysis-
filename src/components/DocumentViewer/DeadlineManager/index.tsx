import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast";
import { Deadline } from '../types';
import { DeadlineManagerProps } from './types';
import { AddDeadlineForm } from './AddDeadlineForm';
import { DeadlineList } from './DeadlineList';
import { v4 as uuidv4 } from 'uuid';

export const DeadlineManager: React.FC<DeadlineManagerProps> = ({ 
  documentId, 
  deadlines = [], 
  isLoading = false,
  onDeadlineUpdated = () => {}
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [localDeadlines, setLocalDeadlines] = useState<Deadline[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setLocalDeadlines(deadlines);
  }, [deadlines]);

  // Check for approaching deadlines
  useEffect(() => {
    const checkDeadlines = () => {
      const now = new Date();
      localDeadlines.forEach(deadline => {
        const dueDate = new Date(deadline.due_date);
        const hoursDiff = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (hoursDiff <= 24 && hoursDiff > 23) {
          toast({
            title: "24 Hour Alert",
            description: `Alert: ${deadline.title} must be done in 24 hours`,
            duration: 10000,
          });
        } else if (hoursDiff <= 4 && hoursDiff > 3) {
          toast({
            title: "4 Hour Alert",
            description: `Alert: ${deadline.title} must be done in 4 hours`,
            duration: 10000,
          });
        }
      });
    };

    const interval = setInterval(checkDeadlines, 1000 * 60); // Check every minute
    return () => clearInterval(interval);
  }, [localDeadlines, toast]);

  const handleAddDeadline = async (newDeadlineData: Omit<Deadline, 'id' | 'created_at'>) => {
    try {
      // Add id and created_at to the deadline
      const newDeadline: Deadline = {
        ...newDeadlineData,
        id: uuidv4(),
        created_at: new Date().toISOString()
      };
      
      const currentDeadlines = [...localDeadlines];
      console.log('Adding new deadline:', newDeadline);

      const { error } = await supabase
        .from('documents')
        .update({
          deadlines: [...currentDeadlines, newDeadline]
        })
        .eq('id', documentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Deadline added successfully"
      });

      setIsAdding(false);
      onDeadlineUpdated();
    } catch (error: any) {
      console.error('Error adding deadline:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add deadline"
      });
    }
  };

  const removeDeadline = async (deadlineId: string) => {
    try {
      const currentDeadlines = [...localDeadlines];
      const updatedDeadlines = currentDeadlines.filter(deadline => deadline.id !== deadlineId);

      const { error } = await supabase
        .from('documents')
        .update({
          deadlines: updatedDeadlines
        })
        .eq('id', documentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Deadline removed successfully"
      });

      onDeadlineUpdated();
    } catch (error: any) {
      console.error('Error removing deadline:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to remove deadline"
      });
    }
  };
  
  const handleStatusChange = async (deadlineId: string, status: Deadline['status']) => {
    try {
      const currentDeadlines = [...localDeadlines];
      const updatedDeadlines = currentDeadlines.map(deadline => 
        deadline.id === deadlineId ? {...deadline, status} : deadline
      );

      const { error } = await supabase
        .from('documents')
        .update({
          deadlines: updatedDeadlines
        })
        .eq('id', documentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Deadline status updated"
      });

      onDeadlineUpdated();
    } catch (error: any) {
      console.error('Error updating deadline status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update deadline status"
      });
    }
  };
  
  const handleEditDeadline = async (editedDeadline: Deadline) => {
    try {
      const currentDeadlines = [...localDeadlines];
      const updatedDeadlines = currentDeadlines.map(deadline => 
        deadline.id === editedDeadline.id ? editedDeadline : deadline
      );

      const { error } = await supabase
        .from('documents')
        .update({
          deadlines: updatedDeadlines
        })
        .eq('id', documentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Deadline updated"
      });

      onDeadlineUpdated();
    } catch (error: any) {
      console.error('Error editing deadline:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to edit deadline"
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
        <AddDeadlineForm
          onSubmit={handleAddDeadline}
          onCancel={() => setIsAdding(false)}
        />
      )}

      <DeadlineList
        deadlines={localDeadlines}
        onRemove={removeDeadline}
        onStatusChange={handleStatusChange}
        onEdit={handleEditDeadline}
        onDelete={removeDeadline}
      />
    </div>
  );
};
