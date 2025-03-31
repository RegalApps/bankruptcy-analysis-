
import React from "react";
import { MeetingFeedbackForm } from "@/components/meetings/feedback/MeetingFeedbackForm";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const FeedbackStandalonePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // Get meeting details from query parameters
  const meetingId = queryParams.get('id') || 'unknown-meeting';
  const meetingTitle = queryParams.get('title') || 'Meeting Feedback';
  const clientName = queryParams.get('client') || undefined;
  const editMode = queryParams.get('edit') === 'true';
  
  const handleComplete = () => {
    window.close();
    // If window doesn't close (e.g., not opened by script), navigate back
    navigate('/meetings');
  };
  
  return (
    <div className="container max-w-3xl py-8 mx-auto">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => navigate('/meetings')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Meetings
      </Button>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>
            {editMode ? "Edit Feedback Questions" : "Meeting Feedback"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MeetingFeedbackForm
            meetingId={meetingId}
            meetingTitle={meetingTitle}
            clientName={clientName}
            onComplete={handleComplete}
            editMode={editMode}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackStandalonePage;
