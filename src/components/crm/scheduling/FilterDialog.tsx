
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: {
    showHighPriority: boolean;
    showMediumPriority: boolean;
    showRegularMeetings: boolean;
    showSelfBooked: boolean;
  };
  setFilters: (filters: {
    showHighPriority: boolean;
    showMediumPriority: boolean;
    showRegularMeetings: boolean;
    showSelfBooked: boolean;
  }) => void;
}

export const FilterDialog: React.FC<FilterDialogProps> = ({ 
  open, 
  onOpenChange, 
  filters, 
  setFilters 
}) => {
  const [tempFilters, setTempFilters] = React.useState(filters);

  React.useEffect(() => {
    setTempFilters(filters);
  }, [filters, open]);

  const handleSave = () => {
    setFilters(tempFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    const resetFilters = {
      showHighPriority: true,
      showMediumPriority: true,
      showRegularMeetings: true,
      showSelfBooked: true
    };
    setTempFilters(resetFilters);
    setFilters(resetFilters);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter Appointments</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="high-priority" className="font-normal">
              High Priority Appointments
            </Label>
            <Switch 
              id="high-priority" 
              checked={tempFilters.showHighPriority}
              onCheckedChange={(checked) => setTempFilters({...tempFilters, showHighPriority: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="medium-priority" className="font-normal">
              Medium Priority Appointments
            </Label>
            <Switch 
              id="medium-priority" 
              checked={tempFilters.showMediumPriority}
              onCheckedChange={(checked) => setTempFilters({...tempFilters, showMediumPriority: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="regular-meetings" className="font-normal">
              Regular Meetings
            </Label>
            <Switch 
              id="regular-meetings" 
              checked={tempFilters.showRegularMeetings}
              onCheckedChange={(checked) => setTempFilters({...tempFilters, showRegularMeetings: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="self-booked" className="font-normal">
              Self-Booked Appointments
            </Label>
            <Switch 
              id="self-booked" 
              checked={tempFilters.showSelfBooked}
              onCheckedChange={(checked) => setTempFilters({...tempFilters, showSelfBooked: checked})}
            />
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset}>
            Reset All
          </Button>
          <Button onClick={handleSave}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
