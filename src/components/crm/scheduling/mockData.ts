
// Mock appointment data
export const appointments = [
  {
    id: "1",
    title: "Initial Consultation",
    date: new Date(),
    startTime: "09:00",
    endTime: "10:00",
    clientName: "Jane Smith",
    status: "confirmed" as const,
    priority: "high" as const
  },
  {
    id: "2",
    title: "Follow-up Meeting",
    date: new Date(),
    startTime: "13:30",
    endTime: "14:30",
    clientName: "Robert Johnson",
    status: "pending" as const,
    priority: "medium" as const
  },
  {
    id: "3",
    title: "Financial Assessment",
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    startTime: "11:00",
    endTime: "12:00",
    clientName: "Maria Garcia",
    status: "confirmed" as const,
    priority: "high" as const
  },
  {
    id: "4",
    title: "Document Review",
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    startTime: "14:00",
    endTime: "15:00",
    clientName: "Jane Smith",
    status: "pending" as const,
    priority: "normal" as const
  },
  {
    id: "5",
    title: "Self-Booked Consultation",
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
    startTime: "10:30",
    endTime: "11:30",
    clientName: "David Wilson",
    status: "self-booked" as const,
    priority: "medium" as const
  }
];

// Mock staff availability data
export const staffAvailability = [
  {
    id: "staff1",
    name: "John Adams",
    role: "Financial Advisor",
    availability: "available" as const
  },
  {
    id: "staff2",
    name: "Sarah Miller",
    role: "Insolvency Trustee",
    availability: "busy" as const
  },
  {
    id: "staff3",
    name: "Michael Chen",
    role: "Legal Counsel",
    availability: "away" as const
  },
  {
    id: "staff4",
    name: "Emily Wilson",
    role: "Client Coordinator",
    availability: "available" as const
  }
];

// Mock AI suggestions
export const aiSuggestions = [
  {
    id: "sug1",
    type: "reschedule" as const,
    description: "Jane Smith's meeting conflicts with staff availability. Consider rescheduling to tomorrow at 2 PM.",
    priority: "high" as const,
    action: "Reschedule Now"
  },
  {
    id: "sug2",
    type: "optimize" as const,
    description: "You have 3 back-to-back meetings on Friday. Consider adding buffer time between them.",
    priority: "medium" as const,
    action: "View Schedule"
  },
  {
    id: "sug3",
    type: "reminder" as const,
    description: "Robert Johnson needs to submit documents before next week's meeting.",
    priority: "medium" as const,
    action: "Send Reminder"
  },
  {
    id: "sug4",
    type: "conflict" as const,
    description: "Two appointments scheduled at the same time on Monday at 10 AM.",
    priority: "high" as const,
    action: "Resolve Conflict"
  }
];
