
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Check,
  Briefcase
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

// Mock user data
const users = [
  {
    id: "1",
    name: "John Smith",
    role: "Licensed Insolvency Trustee",
    avatar: "/placeholder.svg",
    availability: ["09:00 AM", "10:30 AM", "02:00 PM", "04:30 PM"],
    color: "bg-blue-500"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    role: "Financial Advisor",
    avatar: "/placeholder.svg",
    availability: ["08:30 AM", "11:00 AM", "01:30 PM", "03:00 PM"],
    color: "bg-green-500"
  },
  {
    id: "3",
    name: "Michael Thompson",
    role: "Bankruptcy Specialist",
    avatar: "/placeholder.svg",
    availability: ["10:00 AM", "12:30 PM", "03:30 PM", "05:00 PM"],
    color: "bg-purple-500"
  }
];

// Mock appointment types
const appointmentTypes = [
  { id: "initial", name: "Initial Consultation", duration: 60 },
  { id: "filing", name: "Bankruptcy Filing", duration: 90 },
  { id: "proposal", name: "Consumer Proposal", duration: 90 },
  { id: "followup", name: "Follow-up Meeting", duration: 45 },
  { id: "creditCounseling", name: "Credit Counseling", duration: 60 }
];

export const IntelligentScheduling = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedUser, setSelectedUser] = useState<string>(users[0].id);
  const [appointmentType, setAppointmentType] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");

  const selectedUserData = users.find(user => user.id === selectedUser);

  const handleScheduleAppointment = () => {
    if (!date || !selectedTimeSlot || !appointmentType) {
      toast.error("Please select date, time and appointment type");
      return;
    }

    const selectedAppointment = appointmentTypes.find(type => type.id === appointmentType);
    
    toast.success("Appointment Scheduled", {
      description: `Scheduled with ${selectedUserData?.name} on ${date.toLocaleDateString()} at ${selectedTimeSlot} for ${selectedAppointment?.name}`
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Smart Scheduling</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* User selection */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Select Staff Member</h3>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{user.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Appointment type selection */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Appointment Type</h3>
                <Select value={appointmentType} onValueChange={setAppointmentType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select appointment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex justify-between w-full items-center">
                          <span>{type.name}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {type.duration} min
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date selection */}
              <div>
                <h3 className="text-sm font-medium mb-2">Select Date</h3>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  // Disable weekends and past dates
                  disabled={(date) => {
                    const now = new Date();
                    now.setHours(0, 0, 0, 0);
                    return date < now || date.getDay() === 0 || date.getDay() === 6;
                  }}
                />
              </div>
            </div>

            <div className="space-y-4">
              {/* Selected user profile */}
              {selectedUserData && (
                <Card className="border border-dashed mb-4">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={selectedUserData.avatar} alt={selectedUserData.name} />
                        <AvatarFallback className={selectedUserData.color + " text-white"}>
                          {selectedUserData.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{selectedUserData.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedUserData.role}</p>
                        <div className="flex items-center mt-2">
                          <Briefcase className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            Available {selectedUserData.availability.length} slots today
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <h3 className="font-medium">AI Recommended Slots</h3>
              <div className="space-y-2">
                {selectedUserData?.availability.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTimeSlot === time ? "default" : "outline"}
                    className="w-full justify-between"
                    onClick={() => setSelectedTimeSlot(time)}
                  >
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {time}
                    </div>
                    {selectedTimeSlot === time && (
                      <Check className="h-4 w-4 text-white" />
                    )}
                  </Button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                These times are intelligently suggested based on {selectedUserData?.name}'s 
                availability and client requirements.
              </p>

              {/* Schedule button */}
              <Button 
                className="w-full mt-4" 
                disabled={!date || !selectedTimeSlot || !appointmentType}
                onClick={handleScheduleAppointment}
              >
                Schedule Appointment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
