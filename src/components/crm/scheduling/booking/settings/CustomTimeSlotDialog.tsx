
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { TimeSlot } from "../types";

interface CustomTimeSlotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTimeSlot: (time: string) => void;
}

export const CustomTimeSlotDialog: React.FC<CustomTimeSlotDialogProps> = ({
  open,
  onOpenChange,
  onAddTimeSlot
}) => {
  const [newTime, setNewTime] = useState("09:00");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTimeSlot(newTime);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Custom Time Slot</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Time Slot</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
