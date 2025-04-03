
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface QuickBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultClientName?: string;
}

export const QuickBookDialog: React.FC<QuickBookDialogProps> = ({
  open,
  onOpenChange,
  defaultClientName = ""
}) => {
  const [clientName, setClientName] = useState(defaultClientName);
  const [meetingType, setMeetingType] = useState("initial-consultation");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState("09:00");
  
  // Update client name when defaultClientName changes or dialog opens
  useEffect(() => {
    if (open && defaultClientName) {
      setClientName(defaultClientName);
    }
  }, [open, defaultClientName]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would create an appointment
    toast.success(`Appointment scheduled with ${clientName} on ${format(selectedDate, "MMMM d, yyyy")} at ${selectedTime}`);
    onOpenChange(false);
    
    // Reset form (except client name if provided by default)
    if (!defaultClientName) {
      setClientName("");
    }
    setMeetingType("initial-consultation");
    setSelectedDate(new Date());
    setSelectedTime("09:00");
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule Appointment</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientName" className="text-right">
                Client Name
              </Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="meetingType" className="text-right">
                Meeting Type
              </Label>
              <Select 
                value={meetingType}
                onValueChange={setMeetingType}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select meeting type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="initial-consultation">Initial Consultation</SelectItem>
                  <SelectItem value="follow-up">Follow-up Meeting</SelectItem>
                  <SelectItem value="document-review">Document Review</SelectItem>
                  <SelectItem value="financial-planning">Financial Planning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Date
              </Label>
              <div className="col-span-3">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                  disabled={(date) => date < new Date()}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Schedule Appointment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
