
import { useState } from "react";
import { 
  addDays, 
  addWeeks, 
  subWeeks, 
  addMonths, 
  subMonths 
} from "date-fns";

export const useCalendarNavigation = (
  initialDate: Date,
  initialView: "day" | "week" | "month"
) => {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [calendarView, setCalendarView] = useState<"day" | "week" | "month">(initialView);
  
  // Handle navigation based on current view
  const handlePrevious = () => {
    if (calendarView === "day") {
      setSelectedDate(addDays(selectedDate, -1));
    } else if (calendarView === "week") {
      setSelectedDate(subWeeks(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  };

  const handleNext = () => {
    if (calendarView === "day") {
      setSelectedDate(addDays(selectedDate, 1));
    } else if (calendarView === "week") {
      setSelectedDate(addWeeks(selectedDate, 1));
    } else {
      setSelectedDate(addMonths(selectedDate, 1));
    }
  };

  return {
    selectedDate,
    setSelectedDate,
    calendarView,
    setCalendarView,
    handlePrevious,
    handleNext
  };
};
