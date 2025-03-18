
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { 
  format, 
  addDays, 
  startOfWeek, 
  endOfWeek, 
  addWeeks, 
  subWeeks, 
  addMonths, 
  subMonths
} from "date-fns";

interface CalendarHeaderProps {
  selectedDate: Date;
  calendarView: "day" | "week" | "month";
  onPrevious: () => void;
  onNext: () => void;
}

export const CalendarHeader = ({ 
  selectedDate, 
  calendarView, 
  onPrevious, 
  onNext 
}: CalendarHeaderProps) => {
  // Format header based on current view
  const getHeaderText = () => {
    if (calendarView === "day") {
      return format(selectedDate, "PPPP");
    } else if (calendarView === "week") {
      const start = startOfWeek(selectedDate);
      const end = endOfWeek(selectedDate);
      return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
    } else {
      return format(selectedDate, "MMMM yyyy");
    }
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <Button variant="outline" size="icon" onClick={onPrevious}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <h3 className="text-lg font-medium">{getHeaderText()}</h3>
      <Button variant="outline" size="icon" onClick={onNext}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
