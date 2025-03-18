
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Save, RefreshCw, Clock } from "lucide-react";
import { toast } from "sonner";

export const BookingSettingsPanel = () => {
  const [bookingWindow, setBookingWindow] = useState(14); // Days in advance clients can book
  const [minNotice, setMinNotice] = useState(24); // Minimum hours of notice needed
  const [autoConfirm, setAutoConfirm] = useState(false); // Whether to auto-confirm appointments
  const [publicHolidays, setPublicHolidays] = useState(true); // Block public holidays
  const [aiRecommendations, setAiRecommendations] = useState(true); // Use AI for recommendations
  const [reminderHours, setReminderHours] = useState(24); // Hours before appointment to send reminder
  const [availableTimeSlots, setAvailableTimeSlots] = useState([
    { id: "1", time: "09:00", enabled: true },
    { id: "2", time: "10:30", enabled: true },
    { id: "3", time: "13:00", enabled: true },
    { id: "4", time: "14:30", enabled: true },
    { id: "5", time: "16:00", enabled: true },
  ]);
  
  // Toggle a time slot
  const toggleTimeSlot = (id: string) => {
    setAvailableTimeSlots(prev => 
      prev.map(slot => 
        slot.id === id ? { ...slot, enabled: !slot.enabled } : slot
      )
    );
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
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="text-lg font-medium">Booking Rules</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Booking Window (days in advance)
                </label>
                <Input 
                  type="number" 
                  min={1} 
                  max={90} 
                  value={bookingWindow}
                  onChange={(e) => setBookingWindow(parseInt(e.target.value))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Clients can book appointments up to {bookingWindow} days in advance
                </p>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Minimum Notice (hours)
                </label>
                <Input 
                  type="number" 
                  min={1} 
                  max={72} 
                  value={minNotice}
                  onChange={(e) => setMinNotice(parseInt(e.target.value))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Clients must book at least {minNotice} hours before the appointment time
                </p>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Reminder Email (hours before appointment)
                </label>
                <Input 
                  type="number" 
                  min={1} 
                  max={72} 
                  value={reminderHours}
                  onChange={(e) => setReminderHours(parseInt(e.target.value))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Send a reminder email {reminderHours} hours before the appointment
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">Auto-Confirm Appointments</div>
                  <p className="text-xs text-muted-foreground">
                    Automatically confirm appointments without manual review
                  </p>
                </div>
                <Switch 
                  checked={autoConfirm} 
                  onCheckedChange={setAutoConfirm} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">Block Public Holidays</div>
                  <p className="text-xs text-muted-foreground">
                    Prevent booking on public holidays
                  </p>
                </div>
                <Switch 
                  checked={publicHolidays} 
                  onCheckedChange={setPublicHolidays} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">AI Recommendations</div>
                  <p className="text-xs text-muted-foreground">
                    Use AI to recommend optimal time slots based on case priority
                  </p>
                </div>
                <Switch 
                  checked={aiRecommendations} 
                  onCheckedChange={setAiRecommendations} 
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Available Time Slots</h3>
              <Button variant="outline" size="sm" onClick={handleSyncCalendar}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Sync with Calendar
              </Button>
            </div>
            
            <div className="space-y-3">
              {availableTimeSlots.map(slot => (
                <div 
                  key={slot.id} 
                  className={`flex items-center justify-between p-3 border rounded-md ${
                    slot.enabled ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center">
                    <Clock className={`h-4 w-4 mr-2 ${slot.enabled ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className={slot.enabled ? 'font-medium' : 'text-muted-foreground'}>
                      {slot.time}
                    </span>
                  </div>
                  <Switch 
                    checked={slot.enabled} 
                    onCheckedChange={() => toggleTimeSlot(slot.id)} 
                  />
                </div>
              ))}
              
              <Button variant="outline" className="w-full">
                <Clock className="h-4 w-4 mr-2" />
                Add Custom Time Slot
              </Button>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Staff Availability</h4>
              <div className="text-xs text-muted-foreground mb-2">
                Configure individual availability for each staff member:
              </div>
              <Button size="sm" variant="outline" className="w-full">
                Manage Staff Availability
              </Button>
            </div>
          </CardContent>
        </Card>
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
