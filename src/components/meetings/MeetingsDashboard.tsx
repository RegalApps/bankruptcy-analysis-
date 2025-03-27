
import { useState } from "react";
import { MeetingsHeader } from "./MeetingsHeader";
import { MeetingsTabs } from "./MeetingsTabs";
import { IntegrationsPanel } from "./IntegrationsPanel";
import { UpcomingMeetings } from "./UpcomingMeetings";
import { JoinMeetingPanel } from "./JoinMeetingPanel";
import { useToast } from "@/hooks/use-toast";

export const MeetingsDashboard = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "integrations" | "join">("upcoming");
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <MeetingsHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <MeetingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="mt-6">
        {activeTab === "upcoming" && <UpcomingMeetings />}
        {activeTab === "integrations" && <IntegrationsPanel />}
        {activeTab === "join" && <JoinMeetingPanel />}
      </div>
    </div>
  );
};
