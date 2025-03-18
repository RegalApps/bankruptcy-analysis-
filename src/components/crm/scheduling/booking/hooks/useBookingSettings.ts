
import { useState } from "react";
import { toast } from "sonner";
import { TimeSlot } from "../types";

export const useBookingSettings = () => {
  const [bookingWindow, setBookingWindow] = useState(14); // Days in advance clients can book
  const [minNotice, setMinNotice] = useState(24); // Minimum hours of notice needed
  const [autoConfirm, setAutoConfirm] = useState(false); // Whether to auto-confirm appointments
  const [publicHolidays, setPublicHolidays] = useState(true); // Block public holidays
  const [aiRecommendations, setAiRecommendations] = useState(true); // Use AI for recommendations
  const [reminderHours, setReminderHours] = useState(24); // Hours before appointment to send reminder
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([
    { id: "1", time: "09:00", enabled: true },
    { id: "2", time: "10:30", enabled: true },
    { id: "3", time: "13:00", enabled: true },
    { id: "4", time: "14:30", enabled: true },
    { id: "5", time: "16:00", enabled: true },
  ]);
  const [isCustomTimeSlotDialogOpen, setIsCustomTimeSlotDialogOpen] = useState(false);
  
  // Toggle a time slot
  const toggleTimeSlot = (id: string) => {
    setAvailableTimeSlots(prev => 
      prev.map(slot => 
        slot.id === id ? { ...slot, enabled: !slot.enabled } : slot
      )
    );
  };
  
  // Add a new time slot
  const addTimeSlot = (time: string) => {
    const id = `${Date.now()}`;
    setAvailableTimeSlots(prev => [
      ...prev,
      { id, time, enabled: true }
    ]);
    toast.success(`Added time slot: ${time}`);
  };
  
  // Handle saving settings
  const handleSaveSettings = () => {
    // In a real app, this would save to a database
    toast.success("Booking settings saved successfully");
  };
  
  // Handle syncing with calendar
  const handleSyncCalendar = () => {
    toast.success("Calendar synced successfully");
  };

  return {
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
  };
};
