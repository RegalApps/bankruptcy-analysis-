
import { useState } from "react";
import { 
  addDays, 
  addWeeks, 
  subWeeks, 
  addMonths, 
  subMonths 
} from "date-fns";

export const useCalendarNavigation = (
  selectedDate: Date,
  calendarView: "day" | "week" | "month",
  setSelectedDate: (date: Date) => void
) => {
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
    handlePrevious,
    handleNext
  };
};
