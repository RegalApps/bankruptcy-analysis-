
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Clock, Calendar, Search } from "lucide-react";

// Type definitions for booking requests
interface ConfirmedSlot {
  date: string;
  time: string;
  trustee: string;
}

interface BookingRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  caseType: string;
  requestDate: string;
  status: string;
  preferredDates: string[];
  urgency: string;
  caseNumber?: string; // Make caseNumber optional for all requests
  confirmedSlot?: ConfirmedSlot;
}

// Sample booking request data - in a real app this would come from a database
const SAMPLE_BOOKING_REQUESTS: BookingRequest[] = [
  {
    id: "br-001",
    clientName: "Michael Johnson",
    clientEmail: "michael.johnson@example.com",
    caseType: "Consumer Proposal",
    requestDate: "2023-06-15T10:30:00Z",
    status: "pending",
    preferredDates: ["2023-06-20", "2023-06-22", "2023-06-24"],
    caseNumber: "CP-2023-078",
    urgency: "medium"
  },
  {
    id: "br-002",
    clientName: "Jennifer Williams",
    clientEmail: "j.williams@example.com",
    caseType: "Bankruptcy",
    requestDate: "2023-06-14T14:45:00Z",
    status: "confirmed",
    preferredDates: ["2023-06-19"],
    caseNumber: "BK-2023-142",
    urgency: "high",
    confirmedSlot: {
      date: "2023-06-19",
      time: "10:00 AM",
      trustee: "John Smith"
    }
  },
  {
    id: "br-003",
    clientName: "Robert Davis",
    clientEmail: "robert.d@example.com",
    caseType: "Financial Assessment",
    requestDate: "2023-06-13T09:15:00Z",
    status: "pending",
    preferredDates: ["2023-06-21", "2023-06-23"],
    urgency: "low"
  }
];

export const BookingRequestList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [requests, setRequests] = useState<BookingRequest[]>(SAMPLE_BOOKING_REQUESTS);
  
  // Filter requests based on search query
  const filteredRequests = requests.filter(
    request => 
      request.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (request.caseNumber && request.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Function to confirm a booking request
  const confirmBooking = (requestId: string) => {
    setRequests(prevRequests => 
      prevRequests.map(request => 
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
      )
    );
  };
  
  // Get status badge color
  const getStatusBadge = (status: string) => {
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
  const getUrgencyBadge = (urgency: string) => {
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
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search requests by client name, email or case number" 
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">Filter</Button>
        <Button variant="outline">Sort</Button>
      </div>
      
      <div className="rounded-md border">
        <div className="grid grid-cols-[1fr,auto,auto,auto] items-center gap-4 p-4 text-sm font-medium">
          <div>Client</div>
          <div>Request Date</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <div 
              key={request.id} 
              className="grid grid-cols-[1fr,auto,auto,auto] items-center gap-4 p-4 text-sm border-t"
            >
              <div>
                <div className="font-medium">{request.clientName}</div>
                <div className="text-xs text-muted-foreground mt-1">{request.clientEmail}</div>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline">{request.caseType}</Badge>
                  {getUrgencyBadge(request.urgency)}
                </div>
                {request.caseNumber && (
                  <div className="text-xs text-muted-foreground mt-1">Case: {request.caseNumber}</div>
                )}
              </div>
              
              <div className="text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(request.requestDate).toLocaleDateString()}
                </div>
                <div className="mt-1">
                  <div className="font-medium text-xs mt-1">Preferred Dates:</div>
                  {request.preferredDates.map((date, index) => (
                    <div key={index} className="flex items-center mt-0.5">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(date).toLocaleDateString()}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                {getStatusBadge(request.status)}
                {request.status === "confirmed" && request.confirmedSlot && (
                  <div className="text-xs mt-2">
                    <div className="text-green-600 font-medium flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Confirmed
                    </div>
                    <div className="mt-1">
                      {new Date(request.confirmedSlot.date).toLocaleDateString()} at {request.confirmedSlot.time}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      with {request.confirmedSlot.trustee}
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                {request.status === "pending" ? (
                  <div className="space-y-2">
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => confirmBooking(request.id)}
                    >
                      Confirm
                    </Button>
                    <Button size="sm" variant="outline" className="w-full">Details</Button>
                  </div>
                ) : (
                  <Button size="sm" variant="outline">View Details</Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center border-t">
            <p className="text-muted-foreground">No booking requests found</p>
          </div>
        )}
      </div>
    </div>
  );
};
