
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle,
  Clock
} from "lucide-react";
import { format } from "date-fns";

// Mock appointment data types
export interface Appointment {
  id: string;
  clientName: string;
  type: string;
  time: string;
  date: Date;
  priority: 'high' | 'medium' | 'normal';
  status: 'confirmed' | 'pending' | 'self-booked';
  documents: 'complete' | 'incomplete' | 'pending';
  alert: string | null;
  color: string;
}

interface AppointmentsListProps {
  appointments: Appointment[];
  selectedDate: Date;
}

export const AppointmentsList = ({ appointments, selectedDate }: AppointmentsListProps) => {
  // Get appointments for the selected date
  const todayAppointments = appointments.filter(apt => 
    apt.date.getDate() === selectedDate.getDate() &&
    apt.date.getMonth() === selectedDate.getMonth() &&
    apt.date.getFullYear() === selectedDate.getFullYear()
  ).sort((a, b) => {
    const timeA = parseInt(a.time.split(':')[0]);
    const timeB = parseInt(b.time.split(':')[0]);
    return timeA - timeB;
  });

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'normal': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'confirmed': return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Confirmed</Badge>;
      case 'pending': return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>;
      case 'self-booked': return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Self-booked</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getAppointmentColorClass = (appointment: Appointment) => {
    switch(appointment.priority) {
      case 'high': return 'border-l-4 border-red-500';
      case 'medium': return 'border-l-4 border-amber-500';
      case 'normal': return appointment.status === 'self-booked' ? 'border-l-4 border-blue-500' : 'border-l-4 border-green-500';
      default: return 'border-l-4 border-gray-500';
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium mb-3">Appointments for {format(selectedDate, "MMM d, yyyy")}</h3>
      
      {todayAppointments.length > 0 ? (
        <div className="space-y-3">
          {todayAppointments.map((appointment) => (
            <div 
              key={appointment.id} 
              className={`p-3 bg-white rounded-md border ${getAppointmentColorClass(appointment)} flex justify-between hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start gap-3">
                <div className={`rounded-full p-2 ${appointment.color} text-white`}>
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium">{appointment.clientName}</div>
                  <div className="text-sm text-gray-500">{appointment.type}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getPriorityColor(appointment.priority)}>
                      {appointment.priority.charAt(0).toUpperCase() + appointment.priority.slice(1)}
                    </Badge>
                    {getStatusBadge(appointment.status)}
                  </div>
                  {appointment.alert && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      {appointment.alert}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-sm font-medium">{appointment.time}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-6 border border-dashed rounded-md">
          <div className="h-10 w-10 text-gray-300 mx-auto mb-2" />
          <h3 className="text-sm font-medium">No appointments scheduled</h3>
          <p className="text-xs text-gray-500 mt-1">Click "Quick Book" to schedule a meeting</p>
        </div>
      )}
    </div>
  );
};
