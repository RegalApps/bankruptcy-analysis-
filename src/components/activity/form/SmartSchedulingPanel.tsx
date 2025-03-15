
import { useState } from "react";
import { CalendarIcon, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface AppointmentType {
  id: string;
  name: string;
  duration: number;
  description: string;
  urgency: 'low' | 'medium' | 'high';
}

interface SmartSchedulingPanelProps {
  clientName: string;
  suggestedSolution?: string;
  recommendedForms?: Array<{
    formNumber: string;
    formName: string;
    dueDate?: string;
  }>;
}

export const SmartSchedulingPanel = ({ 
  clientName, 
  suggestedSolution = "Consumer Proposal",
  recommendedForms = []
}: SmartSchedulingPanelProps) => {
  const [date, setDate] = useState<Date>();
  const [appointmentType, setAppointmentType] = useState<string>("");
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [showAllSlots, setShowAllSlots] = useState(false);
  
  // Appointment types based on the suggested solution
  const appointmentTypes: AppointmentType[] = [
    {
      id: "initial-consultation",
      name: "Initial Consultation",
      duration: 60,
      description: "First meeting to discuss the client's financial situation and options",
      urgency: 'high'
    },
    {
      id: "document-collection",
      name: "Document Collection Meeting",
      duration: 45,
      description: "Collect all necessary documentation for the insolvency filing",
      urgency: 'medium'
    },
    {
      id: "filing-appointment",
      name: `${suggestedSolution} Filing`,
      duration: 90,
      description: `Complete and sign all paperwork for the ${suggestedSolution}`,
      urgency: 'high'
    },
    {
      id: "credit-counseling",
      name: "Credit Counseling Session",
      duration: 60,
      description: "Mandatory credit counseling session required by BIA",
      urgency: 'medium'
    },
    {
      id: "follow-up",
      name: "Follow-up Meeting",
      duration: 30,
      description: "Review progress and address any concerns",
      urgency: 'low'
    }
  ];
  
  // Generate time slots between 9 AM and 5 PM
  const timeSlots = Array.from({ length: 16 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minute = (i % 2) * 30;
    return `${hour}:${minute === 0 ? '00' : minute}`;
  });
  
  // Calculate suggested meetings based on forms and solution
  const suggestedMeetings = recommendedForms
    .filter(form => form.formNumber && form.dueDate)
    .map(form => ({
      formNumber: form.formNumber,
      formName: form.formName,
      appointmentType: getAppointmentTypeForForm(form.formNumber),
      dueDate: form.dueDate ? new Date(form.dueDate) : undefined
    }));
  
  // Determine appointment type based on form number
  function getAppointmentTypeForForm(formNumber: string): string {
    switch(formNumber) {
      case "1":
      case "2":
        return "initial-consultation";
      case "47":
      case "5":
      case "33":
        return "filing-appointment";
      default:
        return "document-collection";
    }
  }
  
  // Get urgency badge color
  const getUrgencyColor = (urgency: 'low' | 'medium' | 'high') => {
    switch(urgency) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Smart Appointment Scheduling</CardTitle>
          <CardDescription>
            Schedule meetings based on filing requirements and deadlines
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Select Appointment Type</h3>
                <Select value={appointmentType} onValueChange={setAppointmentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select appointment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{type.name}</span>
                          <Badge className={getUrgencyColor(type.urgency)}>
                            {type.urgency}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {appointmentType && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    {appointmentTypes.find(t => t.id === appointmentType)?.description}
                    <div className="mt-1">
                      Duration: {appointmentTypes.find(t => t.id === appointmentType)?.duration} minutes
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Select Date</h3>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) => 
                        date < new Date() || 
                        date.getDay() === 0 || 
                        date.getDay() === 6
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Select Time</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2"
                    onClick={() => setShowAllSlots(!showAllSlots)}
                  >
                    {showAllSlots ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {(showAllSlots ? timeSlots : timeSlots.slice(0, 8)).map((time) => (
                    <Button
                      key={time}
                      variant={timeSlot === time ? "default" : "outline"}
                      size="sm"
                      className="justify-center"
                      onClick={() => setTimeSlot(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
                
                {date && timeSlot && appointmentType && (
                  <Button className="w-full mt-4">
                    Schedule Appointment
                  </Button>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">AI-Suggested Meetings</h3>
              <div className="space-y-3">
                {suggestedMeetings.length > 0 ? (
                  suggestedMeetings.map((meeting, index) => {
                    const appointmentTypeInfo = appointmentTypes.find(
                      t => t.id === meeting.appointmentType
                    );
                    
                    return (
                      <div key={index} className="flex items-start space-x-3 p-3 border rounded-md">
                        <div className="bg-blue-50 p-2 rounded">
                          <Clock className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">
                              {appointmentTypeInfo?.name || "Meeting"}
                            </h4>
                            {appointmentTypeInfo && (
                              <Badge className={getUrgencyColor(appointmentTypeInfo.urgency)}>
                                {appointmentTypeInfo.urgency}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            For: Form {meeting.formNumber} ({meeting.formName})
                          </p>
                          {meeting.dueDate && (
                            <p className="text-xs text-muted-foreground">
                              Deadline: {format(meeting.dueDate, "PPP")}
                            </p>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="mt-2"
                            onClick={() => {
                              setAppointmentType(meeting.appointmentType);
                              if (meeting.dueDate) {
                                // Set date to 3 days before deadline
                                const suggestedDate = new Date(meeting.dueDate);
                                suggestedDate.setDate(suggestedDate.getDate() - 3);
                                setDate(suggestedDate);
                              }
                              setTimeSlot("10:00");
                            }}
                          >
                            Schedule
                          </Button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center border rounded-md">
                    <p className="text-sm text-muted-foreground">
                      No meetings suggested yet. Complete the client intake process to get AI recommendations.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
