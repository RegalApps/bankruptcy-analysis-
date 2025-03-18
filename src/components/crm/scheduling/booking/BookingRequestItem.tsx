
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BookingRequest } from "./types";
import { getStatusBadge, getUrgencyBadge } from "./utils";

interface BookingRequestItemProps {
  request: BookingRequest;
  onConfirm: (requestId: string) => void;
}

export const BookingRequestItem = ({ request, onConfirm }: BookingRequestItemProps) => {
  return (
    <div className="grid grid-cols-[1fr,auto,auto,auto] items-center gap-4 p-4 text-sm border-t">
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
              onClick={() => onConfirm(request.id)}
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
  );
};
