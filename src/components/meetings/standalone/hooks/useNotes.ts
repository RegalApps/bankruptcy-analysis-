
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { exportAsPdf, exportAsText, printNotes, copyToClipboard } from "../../utils/exportUtils";

export const useNotes = () => {
  const [notes, setNotes] = useState<string>("");
  const { toast } = useToast();
  
  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("standalone-notes");
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };
  
  const handleSaveNotes = () => {
    localStorage.setItem("standalone-notes", notes);
    toast({
      title: "Notes saved",
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
    handleExportText
  };
};
