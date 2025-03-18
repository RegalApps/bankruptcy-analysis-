
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { BookingRulesCard } from "./settings/BookingRulesCard";
import { TimeSlotCard } from "./settings/TimeSlotCard";
import { useBookingSettings } from "./hooks/useBookingSettings";

export const BookingSettingsPanel = () => {
  const {
    bookingWindow,
    setBookingWindow,
    minNotice,
    setMinNotice,
    autoConfirm,
    setAutoConfirm,
    publicHolidays,
    setPublicHolidays,
    aiRecommendations,
    setAiRecommendations,
    reminderHours,
    setReminderHours,
    availableTimeSlots,
    toggleTimeSlot,
    addTimeSlot,
    handleSaveSettings,
    handleSyncCalendar,
    isCustomTimeSlotDialogOpen,
    setIsCustomTimeSlotDialogOpen
  } = useBookingSettings();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BookingRulesCard
          bookingWindow={bookingWindow}
          setBookingWindow={setBookingWindow}
          minNotice={minNotice}
          setMinNotice={setMinNotice}
          reminderHours={reminderHours}
          setReminderHours={setReminderHours}
          autoConfirm={autoConfirm}
          setAutoConfirm={setAutoConfirm}
          publicHolidays={publicHolidays}
          setPublicHolidays={setPublicHolidays}
          aiRecommendations={aiRecommendations}
          setAiRecommendations={setAiRecommendations}
        />
        
        <TimeSlotCard 
          availableTimeSlots={availableTimeSlots}
          toggleTimeSlot={toggleTimeSlot}
          handleSyncCalendar={handleSyncCalendar}
          isCustomTimeSlotDialogOpen={isCustomTimeSlotDialogOpen}
          setIsCustomTimeSlotDialogOpen={setIsCustomTimeSlotDialogOpen}
          addTimeSlot={addTimeSlot}
        />
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};
