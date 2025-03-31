
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { exportAsPdf, exportAsText, printNotes, copyToClipboard } from "../../utils/exportUtils";

export const useNotes = () => {
  const [notes, setNotes] = useState<string>("");
  const { toast } = useToast();
  
  // Parse meeting ID from URL if available
  const getMeetingIdFromUrl = (): string | null => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('meeting');
    }
    return null;
  };
  
  // Load notes from localStorage on component mount
  useEffect(() => {
    // Check if we have a meeting ID in the URL
    const meetingId = getMeetingIdFromUrl();
    
    // If we have a meeting ID, try to load shared notes
    if (meetingId) {
      const sharedNotes = localStorage.getItem(`meeting-notes-${meetingId}`);
      if (sharedNotes) {
        setNotes(sharedNotes);
      } else {
        setNotes("Notes for this meeting will appear here once they've been saved by the organizer.");
      }
    } else {
      // No meeting ID - load local notes
      const savedNotes = localStorage.getItem("standalone-notes");
      if (savedNotes) {
        setNotes(savedNotes);
      }
    }
    
    // Set up storage event listener to sync notes between windows
    const handleStorageChange = (e: StorageEvent) => {
      const meetingId = getMeetingIdFromUrl();
      
      if (meetingId && e.key === `meeting-notes-${meetingId}` && e.newValue) {
        setNotes(e.newValue);
      } else if (!meetingId && e.key === "standalone-notes" && e.newValue) {
        setNotes(e.newValue);
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
  };
  
  const handleSaveNotes = () => {
    const meetingId = getMeetingIdFromUrl();
    
    // If we have a meeting ID, save to that specific key
    if (meetingId) {
      localStorage.setItem(`meeting-notes-${meetingId}`, notes);
    }
    
    // Save to the regular standalone notes storage
    localStorage.setItem("standalone-notes", notes);
    
    // Also save to the meeting notes storage for sync with main app
    localStorage.setItem("meeting-notes", notes);
    
    toast({
      description: "Your notes have been saved successfully.",
    });
  };
  
  const handleCopyNotes = () => {
    copyToClipboard(notes);
  };
  
  const handlePrintNotes = () => {
    printNotes(notes);
  };
  
  const handleExportPdf = () => {
    exportAsPdf(notes);
  };
  
  const handleExportText = () => {
    exportAsText(notes);
  };
  
  return {
    notes,
    handleNotesChange,
    handleSaveNotes,
    handleCopyNotes,
    handlePrintNotes,
    handleExportPdf,
    handleExportText,
    isSharedMeeting: !!getMeetingIdFromUrl()
  };
};
