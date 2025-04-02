
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MeetingsHeader } from "./MeetingsHeader";
import { RequestFeedbackDialog } from "./feedback/RequestFeedbackDialog";
import { InviteClientDialog } from "./invitations/InviteClientDialog";

export const MeetingsDashboard = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "join" | "notes" | "agenda" | "analytics">("upcoming");
  const [isRequestFeedbackOpen, setIsRequestFeedbackOpen] = useState(false);
  const [isInviteClientOpen, setIsInviteClientOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState({
    id: "meeting-123",
    title: "Financial Planning Session",
    clientName: "John Doe"
  });
  
  const handleRequestFeedback = () => {
    setIsRequestFeedbackOpen(true);
  };
  
  const handleInviteClient = () => {
    setIsInviteClientOpen(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <MeetingsHeader 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isActiveCall={false}
        onRequestFeedback={handleRequestFeedback}
        onInviteClient={handleInviteClient}
      />
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="join">Join Meeting</TabsTrigger>
          <TabsTrigger value="notes">Meeting Notes</TabsTrigger>
          <TabsTrigger value="agenda">Agendas</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Meetings</CardTitle>
              <CardDescription>
                View and manage your scheduled meetings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Upcoming meetings will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="join">
          <Card>
            <CardHeader>
              <CardTitle>Join a Meeting</CardTitle>
              <CardDescription>
                Join a scheduled meeting or start a new one
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Meeting joining options will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Notes</CardTitle>
              <CardDescription>
                Access and manage your meeting notes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Meeting notes will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="agenda">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Agendas</CardTitle>
              <CardDescription>
                Create and manage meeting agendas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Meeting agendas will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Analytics</CardTitle>
              <CardDescription>
                View insights about your meetings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Meeting analytics will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Request Feedback Dialog */}
      <RequestFeedbackDialog
        open={isRequestFeedbackOpen}
        onOpenChange={setIsRequestFeedbackOpen}
        meetingId={selectedMeeting.id}
        meetingTitle={selectedMeeting.title}
        clientName={selectedMeeting.clientName}
      />
      
      {/* Invite Client Dialog */}
      <InviteClientDialog
        open={isInviteClientOpen}
        onOpenChange={setIsInviteClientOpen}
        meetingId={selectedMeeting.id}
        meetingTitle={selectedMeeting.title}
      />
    </div>
  );
};
