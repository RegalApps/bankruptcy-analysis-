
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
  setFilters: React.Dispatch<React.SetStateAction<{
    showHighPriority: boolean;
    showMediumPriority: boolean;
    showRegularMeetings: boolean;
    showSelfBooked: boolean;
  }>>;
}

export const FilterDialog = ({
  open,
  onOpenChange,
  filters,
  setFilters
}: FilterDialogProps) => {
  const toggleFilter = (key: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const resetFilters = () => {
    setFilters({
      showHighPriority: true,
      showMediumPriority: true,
      showRegularMeetings: true,
      showSelfBooked: true
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Appointments</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="high-priority" className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              High Priority
            </Label>
            <Switch 
              id="high-priority" 
              checked={filters.showHighPriority}
              onCheckedChange={() => toggleFilter('showHighPriority')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="medium-priority" className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-amber-500"></div>
              Medium Priority
            </Label>
            <Switch 
              id="medium-priority" 
              checked={filters.showMediumPriority}
              onCheckedChange={() => toggleFilter('showMediumPriority')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="regular-meetings" className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              Regular Meetings
            </Label>
            <Switch 
              id="regular-meetings" 
              checked={filters.showRegularMeetings}
              onCheckedChange={() => toggleFilter('showRegularMeetings')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="self-booked" className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              Self-Booked
            </Label>
            <Switch 
              id="self-booked" 
              checked={filters.showSelfBooked}
              onCheckedChange={() => toggleFilter('showSelfBooked')}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
