
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Filter,
  CalendarIcon,
  AlertCircle,
  CheckCircle2,
  Clock4
} from "lucide-react";

// Import new components
import { CalendarView } from "./scheduling/CalendarView";
import { AppointmentsList } from "./scheduling/AppointmentsList";
import { AIRecommendations } from "./scheduling/AIRecommendations";
import { StaffAvailability } from "./scheduling/StaffAvailability";
import { QuickActions } from "./scheduling/QuickActions";

// Import mock data
import { appointments, staffAvailability, aiSuggestions } from "./scheduling/mockData";

export const SmartSchedulingCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarView, setCalendarView] = useState<"day" | "week" | "month">("day");
  
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
              {/* Calendar View Component */}
              <CalendarView 
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                calendarView={calendarView}
                setCalendarView={setCalendarView}
                appointments={appointments}
              />
              
              {/* Appointments List Component */}
              <AppointmentsList 
                appointments={appointments}
                selectedDate={selectedDate}
              />
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
            <CardContent>
              <AIRecommendations suggestions={aiSuggestions} />
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
            <CardContent>
              <StaffAvailability staffList={staffAvailability} />
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
              <QuickActions />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
