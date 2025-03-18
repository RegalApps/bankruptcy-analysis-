
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: {
    showHighPriority: boolean;
    showMediumPriority: boolean;
    showRegularMeetings: boolean;
    showSelfBooked: boolean;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    showHighPriority: boolean;
    showMediumPriority: boolean;
    showRegularMeetings: boolean;
    showSelfBooked: boolean;
  }>>;
}

export const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onOpenChange,
  filters,
  setFilters
}) => {
  const handleFilterChange = (key: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Appointments</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="highPriority" 
              checked={filters.showHighPriority}
              onCheckedChange={() => handleFilterChange('showHighPriority')}
            />
            <Label htmlFor="highPriority">High Priority</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="mediumPriority" 
              checked={filters.showMediumPriority}
              onCheckedChange={() => handleFilterChange('showMediumPriority')}
            />
            <Label htmlFor="mediumPriority">Medium Priority</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="regularMeetings" 
              checked={filters.showRegularMeetings}
              onCheckedChange={() => handleFilterChange('showRegularMeetings')}
            />
            <Label htmlFor="regularMeetings">Regular Meetings</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="selfBooked" 
              checked={filters.showSelfBooked}
              onCheckedChange={() => handleFilterChange('showSelfBooked')}
            />
            <Label htmlFor="selfBooked">Self-booked Meetings</Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
