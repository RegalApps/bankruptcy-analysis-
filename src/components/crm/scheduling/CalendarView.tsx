
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronLeft, 
  ChevronRight, 
  CalendarDays, 
  Grid2X2, 
  List,
  ArrowLeft,
  ArrowRight 
} from "lucide-react";
import { 
  format, 
  addDays, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  startOfMonth,
  endOfMonth,
  isSameWeek,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths
} from "date-fns";
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

  // Generate weekly view days
  const getWeekDays = () => {
    const start = startOfWeek(selectedDate);
    return eachDayOfInterval({ start, end: endOfWeek(selectedDate) });
  };

  // Check if appointment is on a specific date
  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => 
      isSameDay(apt.date, date)
    );
  };

  // Determine the appointment color class based on priority and status
  const getAppointmentColorClass = (appointment: Appointment) => {
    switch(appointment.priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'normal': return appointment.status === 'self-booked' ? 'bg-blue-500' : 'bg-green-500';
      default: return 'bg-gray-500';
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
      
      {calendarView === "day" && (
        <div className="border rounded-md p-4">
          <div className="text-center mb-2 font-medium">
            {format(selectedDate, "EEEE, MMMM d")}
          </div>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {Array.from({ length: 12 }, (_, i) => i + 8).map((hour) => {
              const timeString = `${hour}:00`;
              const appointmentsAtTime = appointments.filter(apt => 
                isSameDay(apt.date, selectedDate) && apt.time.startsWith(`${hour}:`)
              );
              
              return (
                <div key={hour} className="grid grid-cols-[60px,1fr] gap-2">
                  <div className="text-sm text-gray-500 text-right pt-2">{timeString}</div>
                  <div className="min-h-[60px] border-l pl-2">
                    {appointmentsAtTime.length > 0 ? (
                      appointmentsAtTime.map(apt => (
                        <div 
                          key={apt.id} 
                          className={`px-2 py-1 mb-1 rounded text-white text-sm ${getAppointmentColorClass(apt)}`}
                        >
                          {apt.time} - {apt.clientName}
                        </div>
                      ))
                    ) : (
                      <div className="h-full border border-dashed border-gray-200 rounded-md"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {calendarView === "week" && (
        <div className="border rounded-md overflow-hidden">
          <div className="grid grid-cols-7 border-b">
            {getWeekDays().map((day, i) => (
              <div 
                key={i} 
                className={`text-center py-2 font-medium ${
                  isSameDay(day, new Date()) ? 'bg-blue-50' : ''
                }`}
              >
                <div>{format(day, "EEE")}</div>
                <div className={`text-lg ${isSameDay(day, selectedDate) ? 'text-blue-600 font-bold' : ''}`}>
                  {format(day, "d")}
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 divide-x h-[350px] overflow-y-auto">
            {getWeekDays().map((day, i) => {
              const dayAppointments = getAppointmentsForDate(day);
              
              return (
                <div 
                  key={i} 
                  className={`p-1 ${isSameDay(day, new Date()) ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedDate(day)}
                >
                  {dayAppointments.length > 0 ? (
                    <div className="space-y-1">
                      {dayAppointments.map(apt => (
                        <div 
                          key={apt.id} 
                          className={`px-2 py-1 rounded text-white text-xs ${getAppointmentColorClass(apt)}`}
                        >
                          <div className="font-medium truncate">{apt.time}</div>
                          <div className="truncate">{apt.clientName}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-gray-400">No Events</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {calendarView === "month" && (
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
      )}
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
      isSameDay(apt.date, selectedDate)
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
      isSameMonth(apt.date, selectedDate)
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
          <div className="text-lg font-bold">{calendarView === "day" ? 8 : calendarView === "week" ? 40 : 120}</div>
        </div>
      </div>
    </div>
  );
};
