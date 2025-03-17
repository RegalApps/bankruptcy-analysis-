
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle,
  Clock3,
  Calendar as CalendarLucide,
  Filter,
  CheckCircle2,
  Clock4,
  BellRing
} from "lucide-react";
import { format, addDays } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Mock appointment data
const appointments = [
  {
    id: "1",
    clientName: "John Doe",
    type: "Bankruptcy Filing",
    time: "10:00 AM",
    date: addDays(new Date(), 1),
    priority: "high",
    status: "confirmed",
    documents: "incomplete",
    alert: "Court Filing for Form 78 (Deadline in 24 hours)",
    color: "bg-red-500"
  },
  {
    id: "2",
    clientName: "Sarah Johnson",
    type: "Consumer Proposal",
    time: "1:30 PM",
    date: addDays(new Date(), 2),
    priority: "medium",
    status: "confirmed",
    documents: "pending",
    alert: "Missing Tax Returns (AI Sent Reminder)",
    color: "bg-amber-500"
  },
  {
    id: "3",
    clientName: "Michael Brown",
    type: "Document Review",
    time: "9:00 AM",
    date: addDays(new Date(), 3),
    priority: "normal",
    status: "self-booked",
    documents: "complete",
    alert: null,
    color: "bg-blue-500"
  },
  {
    id: "4",
    clientName: "Emily Wilson",
    type: "Initial Consultation",
    time: "11:30 AM",
    date: new Date(),
    priority: "normal",
    status: "confirmed",
    documents: "complete",
    alert: null,
    color: "bg-green-500"
  },
  {
    id: "5",
    clientName: "David Thompson",
    type: "Follow-up Meeting",
    time: "3:00 PM",
    date: new Date(),
    priority: "medium",
    status: "confirmed",
    documents: "incomplete",
    alert: "Missing Form 47",
    color: "bg-amber-500"
  }
];

// Staff availability
const staffAvailability = [
  {
    id: "1",
    name: "John Smith",
    role: "Licensed Insolvency Trustee",
    avatar: "/placeholder.svg",
    color: "bg-blue-500",
    schedule: [
      { day: format(new Date(), "EEE"), busy: ["09:00-10:30", "13:00-14:30"] },
      { day: format(addDays(new Date(), 1), "EEE"), busy: ["11:00-12:00", "15:00-16:30"] },
      { day: format(addDays(new Date(), 2), "EEE"), busy: ["10:00-11:30", "14:00-15:00"] }
    ]
  },
  {
    id: "2",
    name: "Sarah Johnson",
    role: "Financial Advisor",
    avatar: "/placeholder.svg",
    color: "bg-green-500",
    schedule: [
      { day: format(new Date(), "EEE"), busy: ["10:00-11:30", "14:00-15:30"] },
      { day: format(addDays(new Date(), 1), "EEE"), busy: ["09:00-10:00", "13:30-15:00"] },
      { day: format(addDays(new Date(), 2), "EEE"), busy: ["11:00-12:30", "16:00-17:00"] }
    ]
  }
];

// AI suggestions
const aiSuggestions = [
  {
    id: "1",
    message: "Reschedule John Doe's meeting—his documents are incomplete",
    priority: "high",
    actionable: true
  },
  {
    id: "2",
    message: "Your next available break is at 12:30 PM. Consider rescheduling the 11:45 AM client call to avoid fatigue",
    priority: "medium",
    actionable: true
  },
  {
    id: "3",
    message: "45% of clients rescheduled their first meeting. Consider improving intake scheduling prompts",
    priority: "low",
    actionable: false
  }
];

export const SmartSchedulingCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarView, setCalendarView] = useState<"day" | "week" | "month">("day");
  
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

  const getAppointmentColorClass = (appointment: any) => {
    switch(appointment.priority) {
      case 'high': return 'border-l-4 border-red-500';
      case 'medium': return 'border-l-4 border-amber-500';
      case 'normal': return appointment.status === 'self-booked' ? 'border-l-4 border-blue-500' : 'border-l-4 border-green-500';
      default: return 'border-l-4 border-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Smart Scheduling System</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button size="sm" className="gap-1">
            <CalendarIcon className="h-4 w-4" />
            Quick Book
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Calendar Area */}
        <div className="col-span-1 lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>AI-Powered Calendar</CardTitle>
                <div className="flex gap-2">
                  <TabsList>
                    <TabsTrigger 
                      value="day" 
                      onClick={() => setCalendarView("day")}
                      className={calendarView === "day" ? "bg-primary text-primary-foreground" : ""}
                    >
                      Day
                    </TabsTrigger>
                    <TabsTrigger 
                      value="week" 
                      onClick={() => setCalendarView("week")}
                      className={calendarView === "week" ? "bg-primary text-primary-foreground" : ""}
                    >
                      Week
                    </TabsTrigger>
                    <TabsTrigger 
                      value="month" 
                      onClick={() => setCalendarView("month")}
                      className={calendarView === "month" ? "bg-primary text-primary-foreground" : ""}
                    >
                      Month
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>
              <CardDescription>
                Schedule appointments, view deadlines, and manage your calendar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Button variant="outline" size="icon" onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setDate(selectedDate.getDate() - 1);
                  setSelectedDate(newDate);
                }}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="text-lg font-medium">{format(selectedDate, "PPPP")}</h3>
                <Button variant="outline" size="icon" onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setDate(selectedDate.getDate() + 1);
                  setSelectedDate(newDate);
                }}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                <div className="md:col-span-5">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border pointer-events-auto"
                    components={{
                      DayContent: (props) => {
                        // Check if there are appointments on this date
                        const hasAppointments = appointments.some(apt => 
                          apt.date.getDate() === props.date.getDate() &&
                          apt.date.getMonth() === props.date.getMonth() &&
                          apt.date.getFullYear() === props.date.getFullYear()
                        );

                        // Check if there are high priority appointments
                        const hasHighPriority = appointments.some(apt => 
                          apt.date.getDate() === props.date.getDate() &&
                          apt.date.getMonth() === props.date.getMonth() &&
                          apt.date.getFullYear() === props.date.getFullYear() &&
                          apt.priority === 'high'
                        );

                        return (
                          <div className="relative">
                            <div>{props.date.getDate()}</div>
                            {hasAppointments && (
                              <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-1 rounded-full ${hasHighPriority ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                            )}
                          </div>
                        );
                      }
                    }}
                  />
                </div>

                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-sm font-medium">Legend</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-500"></div>
                      <span className="text-sm">High Priority</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                      <span className="text-sm">Medium Priority</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-500"></div>
                      <span className="text-sm">Regular Meetings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                      <span className="text-sm">Self-booked Meetings</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-medium pt-2">Stats for {format(selectedDate, "MMM d")}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 p-2 rounded-md">
                      <div className="text-xs text-gray-500">Meetings</div>
                      <div className="text-lg font-bold">{todayAppointments.length}</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-md">
                      <div className="text-xs text-gray-500">Available Slots</div>
                      <div className="text-lg font-bold">4</div>
                    </div>
                  </div>
                </div>
              </div>
              
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
                    <CalendarLucide className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <h3 className="text-sm font-medium">No appointments scheduled</h3>
                    <p className="text-xs text-gray-500 mt-1">Click "Quick Book" to schedule a meeting</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with AI Recommendations and Alerts */}
        <div className="col-span-1 space-y-4">
          {/* AI Recommendations */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiSuggestions.map((suggestion) => (
                <Alert key={suggestion.id} className={suggestion.priority === 'high' ? 'border-red-300 bg-red-50' : suggestion.priority === 'medium' ? 'border-amber-300 bg-amber-50' : 'border-blue-300 bg-blue-50'}>
                  <AlertTitle className="flex items-center gap-2 text-sm">
                    {suggestion.priority === 'high' ? <AlertCircle className="h-4 w-4 text-red-500" /> : 
                     suggestion.priority === 'medium' ? <AlertCircle className="h-4 w-4 text-amber-500" /> : 
                     <AlertCircle className="h-4 w-4 text-blue-500" />}
                    {suggestion.priority === 'high' ? 'Urgent Action Needed' : 
                     suggestion.priority === 'medium' ? 'Recommended Action' : 
                     'Insight'}
                  </AlertTitle>
                  <AlertDescription className="text-sm mt-1">
                    {suggestion.message}
                    {suggestion.actionable && (
                      <div className="mt-2">
                        <Button size="sm" variant="outline" className="text-xs">Take Action</Button>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              ))}
            </CardContent>
          </Card>

          {/* Staff Availability */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Staff Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {staffAvailability.map((staff) => (
                <div key={staff.id} className="border rounded-md p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={staff.avatar} alt={staff.name} />
                      <AvatarFallback className={staff.color + " text-white"}>
                        {staff.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{staff.name}</div>
                      <div className="text-xs text-gray-500">{staff.role}</div>
                    </div>
                  </div>
                  <div className="space-y-1 mt-2">
                    {staff.schedule.map((day, index) => (
                      <div key={index} className="flex justify-between items-center text-xs">
                        <span className="font-medium">{day.day}:</span>
                        <span className="text-gray-500">
                          {day.busy.length > 0 ? 
                            `Busy: ${day.busy.join(', ')}` : 
                            'Fully Available'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Clock4 className="h-4 w-4 text-indigo-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Button className="w-full justify-start gap-2" size="sm">
                  <CalendarIcon className="h-4 w-4" />
                  Schedule a New Meeting
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                  <Clock3 className="h-4 w-4" />
                  Find Earliest Available Slot
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                  <BellRing className="h-4 w-4" />
                  Send Appointment Reminders
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
