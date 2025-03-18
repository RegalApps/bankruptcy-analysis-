
import { Badge } from "@/components/ui/badge";
import { BookingRequest } from "./types";

// Get status badge color
export const getStatusBadge = (status: string) => {
  switch(status) {
    case "pending":
      return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>;
    case "confirmed":
      return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Confirmed</Badge>;
    case "cancelled":
      return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

// Get urgency badge
export const getUrgencyBadge = (urgency: string) => {
  switch(urgency) {
    case "high":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High Priority</Badge>;
    case "medium":
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Medium Priority</Badge>;
    case "low":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Low Priority</Badge>;
    default:
      return null;
  }
};

// Function to confirm a booking request
export const confirmBooking = (requests: BookingRequest[], requestId: string): BookingRequest[] => {
  return requests.map(request => 
    request.id === requestId 
      ? { 
          ...request, 
          status: "confirmed",
          confirmedSlot: {
            date: request.preferredDates[0],
            time: "10:00 AM",
            trustee: "Sarah Johnson"
          }
        } 
      : request
  );
};
