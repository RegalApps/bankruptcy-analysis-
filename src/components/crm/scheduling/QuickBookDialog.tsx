
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { toast } from "sonner";

export interface QuickBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultClientName?: string;
}

export const QuickBookDialog = ({
  open,
  onOpenChange,
  defaultClientName = ""
}: QuickBookDialogProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("09:00");
  const [duration, setDuration] = useState<string>("60");
  const [clientName, setClientName] = useState<string>(defaultClientName);
  const [meetingType, setMeetingType] = useState<string>("consultation");
  const [notes, setNotes] = useState<string>("");

  const handleSubmit = () => {
    if (!selectedDate || !clientName) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Format date for display in toast
    const formattedDate = format(selectedDate, "MMMM d, yyyy");
    
    // Here you would typically save the appointment
    toast.success(`Appointment scheduled with ${clientName} on ${formattedDate} at ${selectedTime}`);
    
    // Close dialog and reset form
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedDate(new Date());
    setSelectedTime("09:00");
    setDuration("60");
    setClientName(defaultClientName);
    setMeetingType("consultation");
    setNotes("");
  };

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Quick Book Appointment</DialogTitle>
          <DialogDescription>
            Quickly schedule a new appointment with a client
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client Name</Label>
              <Input
                id="client"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter client name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="meeting-type">Meeting Type</Label>
              <Select value={meetingType} onValueChange={setMeetingType}>
                <SelectTrigger id="meeting-type">
                  <SelectValue placeholder="Select meeting type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Initial Consultation</SelectItem>
                  <SelectItem value="follow-up">Follow-up Meeting</SelectItem>
                  <SelectItem value="document-review">Document Review</SelectItem>
                  <SelectItem value="financial-planning">Financial Planning</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="border rounded-md p-3"
              />
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger id="time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                    <SelectItem value="120">120 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add meeting notes"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Schedule Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
