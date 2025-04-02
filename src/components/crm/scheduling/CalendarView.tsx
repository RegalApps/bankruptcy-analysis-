
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CalendarDays, 
  Grid2X2, 
  List
} from "lucide-react";

// Import the newly created components
import { CalendarHeader } from "./calendar/CalendarHeader";
import { DayView } from "./calendar/DayView";
import { WeekView } from "./calendar/WeekView";
import { MonthView } from "./calendar/MonthView";
import { useAppointmentUtils } from "./calendar/useAppointmentUtils";
import { Appointment } from "./AppointmentsList";
import { useCalendarNavigation } from "./calendar/useCalendarNavigation";

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
  // Use the appointment utility hook
  const { getAppointmentColorClass } = useAppointmentUtils();

  // Use the calendar navigation hook for handling navigation
  const { handlePrevious, handleNext } = useCalendarNavigation(
    selectedDate,
    calendarView,
    setSelectedDate
  );

  return (
    <div>
      <CalendarHeader 
        selectedDate={selectedDate}
        calendarView={calendarView}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
      
      {calendarView === "day" && (
        <DayView 
          selectedDate={selectedDate}
          appointments={appointments}
          getAppointmentColorClass={getAppointmentColorClass}
        />
      )}
      
      {calendarView === "week" && (
        <WeekView 
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          appointments={appointments}
          getAppointmentColorClass={getAppointmentColorClass}
        />
      )}
      
      {calendarView === "month" && (
        <MonthView 
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          appointments={appointments}
          calendarView={calendarView}
        />
      )}
    </div>
  );
};
