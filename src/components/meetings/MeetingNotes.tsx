
import { NotesHeader } from "./notes/NotesHeader";
import { NotesControls } from "./notes/NotesControls";
import { EmptyNotesAlert } from "./notes/EmptyNotesAlert";
import { NotesCard } from "./notes/NotesCard";
import { useTranscription } from "./notes/useTranscription";

export const MeetingNotes = ({ isStandalone = false }) => {
  const {
    isRecording,
    transcription,
    summary,
    actionItems,
    activeTab,
    setActiveTab,
    toggleRecording,
    exportNotes
  } = useTranscription();
  
  return (
    <div className="space-y-6">
      <NotesHeader 
        title="Meeting Notes & Summaries" 
        isStandalone={isStandalone} 
      />
      
      {!transcription && !isRecording && <EmptyNotesAlert />}
      
      <NotesControls 
        isRecording={isRecording} 
        toggleRecording={toggleRecording} 
        hasTranscription={!!transcription} 
        onExportNotes={exportNotes} 
      />
      
      {(transcription || isRecording) && (
        <NotesCard 
          transcription={transcription}
          summary={summary}
          actionItems={actionItems}
          isRecording={isRecording}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
};
