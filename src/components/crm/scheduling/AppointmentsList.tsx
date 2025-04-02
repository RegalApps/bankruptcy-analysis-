
import React from "react";
import { format, isSameDay } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Calendar, AlertTriangle, CheckCircle } from "lucide-react";

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

interface AppointmentsListProps {
  appointments: Appointment[];
  selectedDate: Date;
}

export const AppointmentsList: React.FC<AppointmentsListProps> = ({
  appointments,
  selectedDate
}) => {
  // Filter appointments for the selected date
  const filteredAppointments = appointments.filter(appointment => 
    isSameDay(new Date(appointment.date), selectedDate)
  );

  // Sort appointments by start time
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="ml-2">High</Badge>;
      case 'medium':
        return <Badge variant="default" className="ml-2 bg-amber-500">Medium</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'cancelled':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'self-booked':
        return <Calendar className="h-4 w-4 text-indigo-500" />;
      default:
        return null;
    }
  };

  if (sortedAppointments.length === 0) {
    return (
      <div className="mt-4 text-center text-muted-foreground">
        No appointments scheduled for {format(selectedDate, "MMMM d, yyyy")}
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      <h3 className="font-medium">
        Appointments for {format(selectedDate, "MMMM d, yyyy")}
      </h3>
      
      {sortedAppointments.map((appointment) => (
        <Card key={appointment.id} className="overflow-hidden">
          <div className={`h-1 ${
            appointment.priority === 'high' ? 'bg-red-500' :
            appointment.priority === 'medium' ? 'bg-amber-500' :
            'bg-green-500'
          }`} />
          <CardContent className="p-3">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="font-medium flex items-center">
                  {appointment.title}
                  {getPriorityBadge(appointment.priority)}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {appointment.startTime} - {appointment.endTime}
                </div>
                {appointment.clientName && (
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {appointment.clientName}
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <div className="flex items-center gap-1.5">
                  {getStatusIcon(appointment.status)}
                  <span className="text-xs capitalize">
                    {appointment.status.replace('-', ' ')}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
