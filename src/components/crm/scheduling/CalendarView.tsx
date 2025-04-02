
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, isToday, isSameDay, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from "date-fns";

// Define the appointment type
interface Appointment {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  clientName?: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'self-booked';
  priority: 'high' | 'medium' | 'normal';
}

interface CalendarViewProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  calendarView: "day" | "week" | "month";
  setCalendarView: (view: "day" | "week" | "month") => void;
  appointments: Appointment[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  selectedDate,
  setSelectedDate,
  calendarView,
  setCalendarView,
  appointments
}) => {
  // Navigation functions
  const navigatePrevious = () => {
    if (calendarView === "day") {
      setSelectedDate(subDays(selectedDate, 1));
    } else if (calendarView === "week") {
      setSelectedDate(subWeeks(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  };

  const navigateNext = () => {
    if (calendarView === "day") {
      setSelectedDate(addDays(selectedDate, 1));
    } else if (calendarView === "week") {
      setSelectedDate(addWeeks(selectedDate, 1));
    } else {
      setSelectedDate(addMonths(selectedDate, 1));
    }
  };

  const navigateToday = () => {
    setSelectedDate(new Date());
  };

  // Function to get the display range for the header
  const getDisplayRange = () => {
    if (calendarView === "day") {
      return format(selectedDate, "MMMM d, yyyy");
    } else if (calendarView === "week") {
      const weekStart = new Date(selectedDate);
      weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
    } else {
      return format(selectedDate, "MMMM yyyy");
    }
  };

  // Function to determine if a day has appointments
  const dayHasAppointments = (day: Date) => {
    return appointments.some(appointment => 
      isSameDay(new Date(appointment.date), day)
    );
  };

  // Custom day rendering component
  const renderDay = (day: Date) => {
    const hasAppointments = dayHasAppointments(day);
    const isSelectedDay = isSameDay(day, selectedDate);
    
    return (
      <div className="relative flex items-center justify-center">
        <div
          className={`
            h-8 w-8 rounded-full flex items-center justify-center
            ${isToday(day) ? 'border border-primary' : ''}
            ${isSelectedDay ? 'bg-primary text-primary-foreground' : ''}
          `}
        >
          {format(day, "d")}
        </div>
        {hasAppointments && !isSelectedDay && (
          <div className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary"/>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="font-medium">{getDisplayRange()}</div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={navigatePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={navigateToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={navigateNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-3">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border"
            components={{
              Day: ({ day }) => renderDay(day)
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};
