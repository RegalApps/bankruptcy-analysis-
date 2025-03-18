
export interface ConfirmedSlot {
  date: string;
  time: string;
  trustee: string;
}

export interface BookingRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  caseType: string;
  requestDate: string;
  status: string;
  preferredDates: string[];
  urgency: string;
  caseNumber?: string;
  confirmedSlot?: ConfirmedSlot;
}

export interface TimeSlot {
  id: string;
  time: string;
  enabled: boolean;
}
