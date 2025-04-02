
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

interface QuickBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QuickBookDialog: React.FC<QuickBookDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [client, setClient] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("normal");
  
  const clients = [
    { id: "1", name: "Jane Smith" },
    { id: "2", name: "Robert Johnson" },
    { id: "3", name: "Maria Garcia" },
    { id: "4", name: "Add New Client..." }
  ];
  
  const handleBookAppointment = () => {
    if (!title) {
      toast.error("Please enter a title for the appointment");
      return;
    }
    if (!client) {
      toast.error("Please select a client");
      return;
    }
    if (!date) {
      toast.error("Please select a date");
      return;
    }
    
    // Here you would normally save the appointment to your database
    toast.success("Appointment booked successfully", {
      description: `${title} with ${client} on ${format(date, "MMMM d, yyyy")} at ${startTime}`
    });
    
    // Reset form and close dialog
    resetForm();
    onOpenChange(false);
  };
  
  const resetForm = () => {
    setDate(new Date());
    setClient("");
    setStartTime("09:00");
    setEndTime("10:00");
    setTitle("");
    setPriority("normal");
  };
  
  // Generate time options for select dropdowns
  const generateTimeOptions = () => {
    const options = [];
    for (let i = 8; i <= 17; i++) {
      for (let j = 0; j < 60; j += 30) {
        const hour = i < 10 ? `0${i}` : `${i}`;
        const minute = j === 0 ? "00" : `${j}`;
        options.push(`${hour}:${minute}`);
      }
    }
    return options;
  };
  
  const timeOptions = generateTimeOptions();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Quick Book Appointment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Appointment Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Initial Consultation"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            <Select value={client} onValueChange={setClient}>
              <SelectTrigger id="client">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger id="start-time" className="flex">
                  <Clock className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={`start-${time}`} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger id="end-time" className="flex">
                  <Clock className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={`end-${time}`} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => {
            resetForm();
            onOpenChange(false);
          }}>
            Cancel
          </Button>
          <Button onClick={handleBookAppointment}>
            Book Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
