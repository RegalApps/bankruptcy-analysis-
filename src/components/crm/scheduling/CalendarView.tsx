
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, CalendarDays, Grid2X2, List } from "lucide-react";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { Appointment } from "./AppointmentsList";

interface CalendarViewProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  calendarView: "day" | "week" | "month";
  setCalendarView: (view: "day" | "week" | "month") => void;
  appointments: Appointment[];
}

export const CalendarView = ({ 
  selectedDate, 
  setSelectedDate, 
  calendarView, 
  setCalendarView,
  appointments 
}: CalendarViewProps) => {
  // Handle navigation based on current view
  const handlePrevious = () => {
    const newDate = new Date(selectedDate);
    if (calendarView === "day") {
      newDate.setDate(selectedDate.getDate() - 1);
    } else if (calendarView === "week") {
      newDate.setDate(selectedDate.getDate() - 7);
    } else {
      newDate.setMonth(selectedDate.getMonth() - 1);
    }
    setSelectedDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(selectedDate);
    if (calendarView === "day") {
      newDate.setDate(selectedDate.getDate() + 1);
    } else if (calendarView === "week") {
      newDate.setDate(selectedDate.getDate() + 7);
    } else {
      newDate.setMonth(selectedDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

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
    <div>
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" size="icon" onClick={handlePrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-medium">{getHeaderText()}</h3>
        <Button variant="outline" size="icon" onClick={handleNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        <div className="md:col-span-5">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border pointer-events-auto"
            components={{
              DayContent: (props) => {
                // Check if there are appointments on this date
                const hasAppointments = appointments.some(apt => 
                  apt.date.getDate() === props.date.getDate() &&
                  apt.date.getMonth() === props.date.getMonth() &&
                  apt.date.getFullYear() === props.date.getFullYear()
                );

                // Check if there are high priority appointments
                const hasHighPriority = appointments.some(apt => 
                  apt.date.getDate() === props.date.getDate() &&
                  apt.date.getMonth() === props.date.getMonth() &&
                  apt.date.getFullYear() === props.date.getFullYear() &&
                  apt.priority === 'high'
                );

                return (
                  <div className="relative">
                    <div>{props.date.getDate()}</div>
                    {hasAppointments && (
                      <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-1 rounded-full ${hasHighPriority ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                    )}
                  </div>
                );
              }
            }}
          />
        </div>

        <div className="md:col-span-2 space-y-4">
          <CalendarLegend />
          <CalendarStats selectedDate={selectedDate} appointments={appointments} calendarView={calendarView} />
        </div>
      </div>
    </div>
  );
};

const CalendarLegend = () => {
  return (
    <div>
      <h3 className="text-sm font-medium">Legend</h3>
      <div className="space-y-2 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span className="text-sm">High Priority</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-amber-500"></div>
          <span className="text-sm">Medium Priority</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span className="text-sm">Regular Meetings</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          <span className="text-sm">Self-booked Meetings</span>
        </div>
      </div>
    </div>
  );
};

const CalendarStats = ({ 
  selectedDate, 
  appointments, 
  calendarView 
}: { 
  selectedDate: Date, 
  appointments: Appointment[],
  calendarView: "day" | "week" | "month"
}) => {
  let filteredAppointments: Appointment[] = [];
  
  if (calendarView === "day") {
    // Filter for the selected day
    filteredAppointments = appointments.filter(apt => 
      apt.date.getDate() === selectedDate.getDate() &&
      apt.date.getMonth() === selectedDate.getMonth() &&
      apt.date.getFullYear() === selectedDate.getFullYear()
    );
  } else if (calendarView === "week") {
    // Filter for the selected week
    const weekStart = startOfWeek(selectedDate);
    const weekEnd = endOfWeek(selectedDate);
    filteredAppointments = appointments.filter(apt => 
      apt.date >= weekStart && apt.date <= weekEnd
    );
  } else {
    // Filter for the selected month
    filteredAppointments = appointments.filter(apt => 
      apt.date.getMonth() === selectedDate.getMonth() &&
      apt.date.getFullYear() === selectedDate.getFullYear()
    );
  }

  // Get period label based on view
  const getPeriodLabel = () => {
    if (calendarView === "day") {
      return format(selectedDate, "MMM d");
    } else if (calendarView === "week") {
      const start = startOfWeek(selectedDate);
      const end = endOfWeek(selectedDate);
      return `${format(start, "MMM d")} - ${format(end, "MMM d")}`;
    } else {
      return format(selectedDate, "MMMM yyyy");
    }
  };

  return (
    <div>
      <h3 className="text-sm font-medium pt-2">Stats for {getPeriodLabel()}</h3>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="bg-gray-50 p-2 rounded-md">
          <div className="text-xs text-gray-500">Meetings</div>
          <div className="text-lg font-bold">{filteredAppointments.length}</div>
        </div>
        <div className="bg-gray-50 p-2 rounded-md">
          <div className="text-xs text-gray-500">Available Slots</div>
          <div className="text-lg font-bold">{calendarView === "day" ? 4 : calendarView === "week" ? 28 : 120}</div>
        </div>
      </div>
    </div>
  );
};
