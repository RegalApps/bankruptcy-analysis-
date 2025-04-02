
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { StaffAvailabilityItem } from "./StaffAvailability";
import { format, isSameDay } from "date-fns";

interface AvailabilityInsightsProps {
  staffAvailability: StaffAvailabilityItem[];
}

// This component shows available consultation slots based on staff availability
export const AvailabilityInsights = ({ staffAvailability }: AvailabilityInsightsProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Get the day name (Monday, Tuesday, etc.) from a date
  const getDayName = (date: Date): string => {
    return format(date, 'EEEE');
  };
  
  // Find available staff members for the selected day
  const getAvailableStaff = () => {
    if (!selectedDate) return [];
    
    const dayName = getDayName(selectedDate);
    
    return staffAvailability.map(staff => {
      const daySchedule = staff.schedule.find(
        schedule => schedule.day.toLowerCase() === dayName.toLowerCase()
      );
      
      const isFullyAvailable = daySchedule?.busy.length === 0;
      const partiallyAvailable = daySchedule && daySchedule.busy.length > 0;
      
      return {
        ...staff,
        isFullyAvailable,
        partiallyAvailable,
        busyTimes: daySchedule?.busy || []
      };
    });
  };
  
  const availableStaff = getAvailableStaff();
  const fullyAvailableStaff = availableStaff.filter(staff => staff.isFullyAvailable);
  const partiallyAvailableStaff = availableStaff.filter(staff => staff.partiallyAvailable);
  
  // Suggested slots based on available staff
  const suggestedSlots = [
    "9:00 AM - 10:00 AM",
    "11:30 AM - 12:30 PM",
    "2:00 PM - 3:00 PM",
    "4:30 PM - 5:30 PM",
  ];
  
  return (
    <div className="space-y-4">
      <div className="border rounded-md overflow-hidden">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="w-full"
        />
      </div>
      
      {selectedDate && (
        <>
          <div>
            <h3 className="text-sm font-medium mb-2">
              Available for {format(selectedDate, 'EEEE, MMMM d')}
            </h3>
            
            {fullyAvailableStaff.length > 0 ? (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {fullyAvailableStaff.map(staff => (
                    <Badge key={staff.id} variant="outline" className={cn("bg-green-50", staff.color)}>
                      {staff.name}
                    </Badge>
                  ))}
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {fullyAvailableStaff.length} staff member{fullyAvailableStaff.length !== 1 ? 's' : ''} fully available
                </div>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">No staff fully available</div>
            )}
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Suggested Consultation Slots</h3>
            <div className="space-y-2">
              {suggestedSlots.map((slot, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  size="sm" 
                  className="flex justify-between w-full text-left"
                >
                  <span>{slot}</span>
                  <Badge variant="secondary" className="ml-2">
                    Book
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
          
          <div className="text-xs">
            <p className="text-green-600 font-medium">Pro Tip:</p>
            <p className="text-muted-foreground">
              Morning slots typically have higher client attendance rates for consultations.
            </p>
          </div>
        </>
      )}
    </div>
  );
};
