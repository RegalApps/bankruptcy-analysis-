
import { format, isSameDay, isSameMonth, startOfWeek, endOfWeek } from "date-fns";
import { Appointment } from "../AppointmentsList";

interface CalendarStatsProps {
  selectedDate: Date;
  appointments: Appointment[];
  calendarView: "day" | "week" | "month";
}

export const CalendarStats = ({ 
  selectedDate, 
  appointments, 
  calendarView 
}: CalendarStatsProps) => {
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
