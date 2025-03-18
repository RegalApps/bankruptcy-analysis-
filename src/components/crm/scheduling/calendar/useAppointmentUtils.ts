
import { Appointment } from "../AppointmentsList";

export const useAppointmentUtils = () => {
  // Determine the appointment color class based on priority and status
  const getAppointmentColorClass = (appointment: Appointment) => {
    switch(appointment.priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'normal': return appointment.status === 'self-booked' ? 'bg-blue-500' : 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return {
    getAppointmentColorClass
  };
};
