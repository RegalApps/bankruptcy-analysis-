
import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, X, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast";
import { DocumentDetails, Deadline } from './types';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface DeadlineManagerProps {
  document: DocumentDetails;
  onDeadlineUpdated: () => void;
}

export const DeadlineManager: React.FC<DeadlineManagerProps> = ({ document, onDeadlineUpdated }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [newDeadline, setNewDeadline] = useState<Deadline>({
    title: '',
    dueDate: '',
    description: ''
  });
  const { toast } = useToast();

  // Check for approaching deadlines
  useEffect(() => {
    const checkDeadlines = () => {
      const now = new Date();
      document.deadlines?.forEach(deadline => {
        const dueDate = new Date(deadline.dueDate);
        const hoursDiff = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (hoursDiff <= 24 && hoursDiff > 23) {
          toast({
            title: "24 Hour Alert",
            description: "Alert: This File Must Be Done in 24 hours",
            duration: 10000,
          });
        } else if (hoursDiff <= 4 && hoursDiff > 3) {
          toast({
            title: "4 Hour Alert",
            description: "Alert: This File Must Be Done in 4 hours",
            duration: 10000,
          });
        }
      });
    };

    const interval = setInterval(checkDeadlines, 1000 * 60); // Check every minute
    return () => clearInterval(interval);
  }, [document.deadlines, toast]);

  const timeOptions = Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    return format(new Date().setHours(hour, minute), 'HH:mm');
  });

  const handleAddDeadline = async () => {
    if (!selectedDate || !selectedTime || !newDeadline.title) {
      toast({
        variant: "destructive",
        title: "Invalid deadline",
        description: "Please provide a title, date, and time"
      });
      return;
    }

    try {
      const deadlineDate = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':').map(Number);
      deadlineDate.setHours(hours, minutes);

      const currentDeadlines = document.deadlines || [];
      const { error } = await supabase
        .from('documents')
        .update({
          deadlines: [...currentDeadlines, {
            ...newDeadline,
            dueDate: deadlineDate.toISOString()
          }]
        })
        .eq('id', document.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Deadline added successfully"
      });

      setIsAdding(false);
      setNewDeadline({ title: '', dueDate: '', description: '' });
      setSelectedDate(undefined);
      setSelectedTime(undefined);
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

          <div className="grid gap-2">
            <label className="text-sm">Date:</label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "w-full justify-start text-left font-normal rounded-md border bg-background px-3 py-2 text-sm",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <label className="text-sm">Time:</label>
            <Select onValueChange={setSelectedTime}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select time">
                  {selectedTime ? (
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      {selectedTime}
                    </div>
                  ) : (
                    "Select time"
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
