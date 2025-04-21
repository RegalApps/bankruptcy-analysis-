
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Deadline } from '../types';
import { AddDeadlineFormProps } from './types';
import { useToast } from "@/hooks/use-toast";

export const AddDeadlineForm: React.FC<AddDeadlineFormProps> = ({ onAdd, onCancel }) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [newDeadline, setNewDeadline] = useState<Partial<Deadline>>({
    title: '',
    due_date: '',
    description: ''
  });
  const { toast } = useToast();

  const timeOptions = Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    return format(new Date().setHours(hour, minute), 'HH:mm');
  });

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !newDeadline.title) {
      toast({
        variant: "destructive",
        title: "Invalid deadline",
        description: "Please provide a title, date, and time"
      });
      return;
    }

    const deadlineDate = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':').map(Number);
    deadlineDate.setHours(hours, minutes);

    await onAdd({
      ...newDeadline,
      status: 'pending',
      due_date: deadlineDate.toISOString()
    } as Deadline);
  };

  return (
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
          onClick={onCancel}
          className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Add Deadline
        </button>
      </div>
    </div>
  );
};
