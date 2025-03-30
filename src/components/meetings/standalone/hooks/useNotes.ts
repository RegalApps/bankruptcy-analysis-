
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  copyNotesToClipboard, 
  printNotes, 
  exportAsPdf, 
  exportAsText 
} from "../utils/exportUtils";

export const useNotes = () => {
  const [notes, setNotes] = useState<string>("");
  const { toast } = useToast();
  
  // Load any saved notes from localStorage when component mounts
  useEffect(() => {
    const savedNotes = localStorage.getItem("meeting-notes");
    if (savedNotes) {
      try {
        // If the saved notes are in JSON format (from our new functionality)
        const parsedNotes = JSON.parse(savedNotes);
        // If it's an array (our new format), take the last entry
        if (Array.isArray(parsedNotes) && parsedNotes.length > 0) {
          const lastEntry = parsedNotes[parsedNotes.length - 1];
          // Construct a full text from the structured data
          const fullNotes = `
TRANSCRIPTION:
${lastEntry.transcription || ""}

${lastEntry.summary ? `SUMMARY:
${lastEntry.summary}

` : ''}${lastEntry.actionItems?.length > 0 ? `ACTION ITEMS:
${lastEntry.actionItems.map((item: string, i: number) => `${i + 1}. ${item}`).join('\n')}` : ''}
          `.trim();
          setNotes(fullNotes);
        } else {
          // If it's the old format (string)
          setNotes(parsedNotes);
        }
      } catch (e) {
        // If it's not JSON, just use the raw string
        setNotes(savedNotes);
      }
    }
  }, []);
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    // Auto-save to localStorage as user types
    localStorage.setItem("meeting-notes", e.target.value);
  };
  
  const handleSaveNotes = () => {
    localStorage.setItem("meeting-notes", notes);
    toast({
      title: "Notes saved",
      description: "Your meeting notes have been saved successfully",
    });
  };
  
  const handleCopyNotes = () => {
    copyNotesToClipboard(notes);
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
    handleExportText
  };
};
