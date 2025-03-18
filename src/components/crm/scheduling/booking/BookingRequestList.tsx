
import { useState } from "react";
import { BookingSearchToolbar } from "./BookingSearchToolbar";
import { BookingRequestItem } from "./BookingRequestItem";
import { SAMPLE_BOOKING_REQUESTS } from "./mockData";
import { BookingRequest } from "./types";
import { confirmBooking } from "./utils";

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
  
  // Handle confirmation
  const handleConfirmBooking = (requestId: string) => {
    setRequests(prevRequests => confirmBooking(prevRequests, requestId));
  };
  
  return (
    <div className="space-y-4">
      <BookingSearchToolbar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <div className="rounded-md border">
        <div className="grid grid-cols-[1fr,auto,auto,auto] items-center gap-4 p-4 text-sm font-medium">
          <div>Client</div>
          <div>Request Date</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <BookingRequestItem 
              key={request.id} 
              request={request}
              onConfirm={handleConfirmBooking}
            />
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
