
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Maximize2Off } from "lucide-react";
import { CalendarView } from "@/components/crm/scheduling/CalendarView";
import { appointments } from "@/components/crm/scheduling/mockData";
import { MainLayout } from "@/components/layout/MainLayout";

const CalendarFullscreenPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialDate = location.state?.initialDate || new Date();
  const initialView = location.state?.initialView || "week";
  
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [calendarView, setCalendarView] = useState<"day" | "week" | "month">(initialView);

  // Handle back navigation
  const handleBack = () => {
    navigate("/crm");
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to CRM
          </Button>
          <h1 className="text-2xl font-bold">Calendar Fullscreen View</h1>
          <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2">
            <Maximize2Off className="h-4 w-4" />
            Exit Fullscreen
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <CalendarView
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              calendarView={calendarView}
              setCalendarView={setCalendarView}
              appointments={appointments}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CalendarFullscreenPage;
