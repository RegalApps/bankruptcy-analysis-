
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GenerateBookingLink } from "./booking/GenerateBookingLink";
import { BookingRequestList } from "./booking/BookingRequestList";
import { BookingTemplateEditor } from "./booking/BookingTemplateEditor";
import { BookingSettingsPanel } from "./booking/BookingSettingsPanel";
import { TabsContainer } from "./booking/TabsContainer";

export const ClientBookingPortal = () => {
  const [currentTab, setCurrentTab] = useState("generate-link");
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Client Self-Booking Portal</CardTitle>
          <CardDescription>
            Allow clients to book their own appointments with AI-recommended time slots based on case priority and trustee availability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TabsContainer 
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            generateLinkContent={<GenerateBookingLink />}
            requestsContent={<BookingRequestList />}
            templatesContent={<BookingTemplateEditor />}
            settingsContent={<BookingSettingsPanel />}
          />
        </CardContent>
      </Card>
    </div>
  );
};
