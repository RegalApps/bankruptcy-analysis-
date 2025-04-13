
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { AddDeadlineFormProps } from './types';
import { Deadline } from '../types';

export const AddDeadlineForm: React.FC<AddDeadlineFormProps> = ({ 
  onSubmit, 
  onCancel 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Deadline['priority']>('medium');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newDeadline: Omit<Deadline, 'id' | 'created_at'> = {
      title,
      description,
      due_date: dueDate,
      status: 'pending', // Default status for new deadlines
      priority,
      type: 'standard'
    };
    
    onSubmit(newDeadline);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Deadline title"
          required
        />
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the deadline (optional)"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="due-date">Due Date</Label>
          <Input
            id="due-date"
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="priority">Priority</Label>
          <Select 
            value={priority} 
            onValueChange={(value: Deadline['priority']) => setPriority(value)}
          >
            <SelectTrigger id="priority">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};
