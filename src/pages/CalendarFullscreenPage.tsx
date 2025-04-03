
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarView } from "@/components/crm/scheduling/CalendarView";
import { StaffAvailability } from "@/components/crm/scheduling/StaffAvailability";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, CheckCircle2, UserCheck, X } from "lucide-react";
import { staffAvailability, appointments } from "@/components/crm/scheduling/mockData";
import { AvailabilityInsights } from "@/components/crm/scheduling/AvailabilityInsights";

interface LocationState {
  initialDate?: Date;
  initialView?: "day" | "week" | "month";
}

const CalendarFullscreenPage = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  
  const [selectedDate, setSelectedDate] = useState<Date>(
    state?.initialDate ? new Date(state.initialDate) : new Date()
  );
  const [calendarView, setCalendarView] = useState<"day" | "week" | "month">(
    state?.initialView || "week"
  );
  
  useEffect(() => {
    document.title = "Calendar Fullscreen View";
    // Ensure we default to week view for fullscreen
    if (calendarView !== "week") {
      setCalendarView("week");
    }
  }, [calendarView]);

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      {/* Header */}
      <header className="bg-background border-b py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/crm">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Trustee Calendar View
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <Link to="/crm">
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-1 p-6 flex gap-6 overflow-hidden">
        {/* Calendar section - 75% width */}
        <div className="flex-grow overflow-auto bg-background rounded-lg border shadow-sm p-4">
          <CalendarView 
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            calendarView={calendarView}
            setCalendarView={setCalendarView}
            appointments={appointments}
          />
        </div>
        
        {/* Right sidebar - 25% width */}
        <div className="w-96 space-y-4 flex-shrink-0">
          {/* Staff Availability Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Staff Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StaffAvailability staffList={staffAvailability} />
            </CardContent>
          </Card>
          
          {/* Free Consultation Slots */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <UserCheck className="h-4 w-4 text-blue-500" />
                Free Consultation Slots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AvailabilityInsights staffAvailability={staffAvailability} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarFullscreenPage;
