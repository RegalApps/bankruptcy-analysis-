
import React, { useState } from 'react';
import { DeadlineManagerProps, Deadline } from '../types';
import { DeadlineList } from './DeadlineList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddDeadlineForm } from './AddDeadlineForm';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export const DeadlineManager: React.FC<DeadlineManagerProps> = ({ 
  documentId,
  deadlines = [],
  isLoading = false,
  onDeadlineUpdated
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [localDeadlines, setLocalDeadlines] = useState<Deadline[]>(deadlines);
  
  // Use deadlines from props if available or fall back to local state
  const displayedDeadlines = deadlines.length > 0 ? deadlines : localDeadlines;

  const handleAddDeadline = async (newDeadline: Omit<Deadline, 'id' | 'created_at'>) => {
    try {
      // In a real app, this would be an API call
      const deadlineToAdd: Deadline = {
        id: uuidv4(), // Generate UUID for local management
        ...newDeadline,
        created_at: new Date().toISOString()
      };
      
      setLocalDeadlines(prev => [...prev, deadlineToAdd]);
      setShowAddForm(false);
      toast.success('Deadline added successfully');
      
      // Call the callback if provided
      if (onDeadlineUpdated) {
        onDeadlineUpdated();
      }
    } catch (error) {
      console.error('Error adding deadline:', error);
      toast.error('Failed to add deadline');
    }
  };

  const handleRemoveDeadline = async (id: string) => {
    try {
      // In a real app, this would be an API call
      setLocalDeadlines(prev => prev.filter(deadline => deadline.id !== id));
      toast.success('Deadline removed successfully');
      
      // Call the callback if provided
      if (onDeadlineUpdated) {
        onDeadlineUpdated();
      }
    } catch (error) {
      console.error('Error removing deadline:', error);
      toast.error('Failed to remove deadline');
    }
  };

  const handleStatusChange = async (id: string, status: Deadline['status']) => {
    try {
      // In a real app, this would be an API call
      setLocalDeadlines(prev => 
        prev.map(deadline => 
          deadline.id === id 
            ? { ...deadline, status } 
            : deadline
        )
      );
      toast.success('Deadline status updated');
      
      // Call the callback if provided
      if (onDeadlineUpdated) {
        onDeadlineUpdated();
      }
    } catch (error) {
      console.error('Error updating deadline status:', error);
      toast.error('Failed to update deadline status');
    }
  };

  const handleEditDeadline = (deadline: Deadline) => {
    // Implement edit functionality here
    console.log('Edit deadline:', deadline);
  };

  const handleDeleteDeadline = async (id: string) => {
    try {
      // In a real app, this would be an API call
      setLocalDeadlines(prev => prev.filter(deadline => deadline.id !== id));
      toast.success('Deadline deleted successfully');
      
      // Call the callback if provided
      if (onDeadlineUpdated) {
        onDeadlineUpdated();
      }
    } catch (error) {
      console.error('Error deleting deadline:', error);
      toast.error('Failed to delete deadline');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Deadlines</h3>
        {!showAddForm && (
          <Button
            onClick={() => setShowAddForm(true)}
            size="sm"
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add
          </Button>
        )}
      </div>
      
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading deadlines...</p>
      ) : showAddForm ? (
        <AddDeadlineForm 
          onSubmit={handleAddDeadline} 
          onCancel={() => setShowAddForm(false)} 
        />
      ) : (
        <DeadlineList 
          deadlines={displayedDeadlines} 
          onRemove={handleRemoveDeadline} 
          onStatusChange={handleStatusChange}
          onEdit={handleEditDeadline}
          onDelete={handleDeleteDeadline}
        />
      )}
    </div>
  );
};
