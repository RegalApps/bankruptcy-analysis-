
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { NotesTabs } from "./NotesTabs";
import { RecordingIndicator } from "./RecordingIndicator";

interface NotesCardProps {
  transcription: string;
  summary: string;
  actionItems: string[];
  isRecording: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const NotesCard = ({ 
  transcription, 
  summary, 
  actionItems, 
  isRecording, 
  activeTab, 
  setActiveTab 
}: NotesCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle>Meeting Intelligence</CardTitle>
        <CardDescription>
          Real-time transcription with AI-generated insights
        </CardDescription>
      </CardHeader>
      
      <NotesTabs 
        transcription={transcription}
        summary={summary}
        actionItems={actionItems}
        isRecording={isRecording}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <RecordingIndicator isRecording={isRecording} />
    </Card>
  );
};
