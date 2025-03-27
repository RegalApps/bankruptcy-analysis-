
import { useState } from "react";
import { MeetingsHeader } from "./MeetingsHeader";
import { MeetingsTabs } from "./MeetingsTabs";
import { IntegrationsPanel } from "./IntegrationsPanel";
import { UpcomingMeetings } from "./UpcomingMeetings";
import { JoinMeetingPanel } from "./JoinMeetingPanel";
import { MeetingNotes } from "./MeetingNotes";
import { MeetingAnalytics } from "./MeetingAnalytics";
import { MeetingAgenda } from "./MeetingAgenda";
import { useToast } from "@/hooks/use-toast";
import { useEnhancedAnalytics } from "@/hooks/useEnhancedAnalytics";

export const MeetingsDashboard = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "integrations" | "join" | "notes" | "analytics" | "agenda">("upcoming");
  const { toast } = useToast();
  const analytics = useEnhancedAnalytics({ pageName: "Meetings" });

  // Track tab changes
  const handleTabChange = (tab: "upcoming" | "integrations" | "join" | "notes" | "analytics" | "agenda") => {
    setActiveTab(tab);
    analytics.trackInteraction("MeetingsTabs", `Changed to ${tab} tab`);
  };

  return (
    <div className="space-y-6">
      <MeetingsHeader activeTab={activeTab} setActiveTab={handleTabChange} />
      
      <MeetingsTabs activeTab={activeTab} setActiveTab={handleTabChange} />
      
      <div className="mt-6">
        {activeTab === "upcoming" && <UpcomingMeetings />}
        {activeTab === "integrations" && <IntegrationsPanel />}
        {activeTab === "join" && <JoinMeetingPanel />}
        {activeTab === "notes" && <MeetingNotes />}
        {activeTab === "analytics" && <MeetingAnalytics />}
        {activeTab === "agenda" && <MeetingAgenda />}
      </div>
    </div>
  );
};
