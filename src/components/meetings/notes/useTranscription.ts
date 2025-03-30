
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { printNotes, exportAsPdf, exportAsText, copyToClipboard } from "../utils/exportUtils";

export const useTranscription = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [summary, setSummary] = useState("");
  const [actionItems, setActionItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("transcription");
  const [savedNotes, setSavedNotes] = useState<{ transcription: string; summary: string; actionItems: string[] }[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate generating summary and action items
      generateSummary();
      toast({
        title: "Recording stopped",
        description: "Transcription complete. Summary and action items generated.",
      });
    } else {
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Meeting transcription is now in progress.",
      });
      // Simulate real-time transcription
      simulateTranscription();
    }
  };
  
  const simulateTranscription = () => {
    // This is a simulation - in a real app, this would connect to a transcription API
    const transcripts = [
      "John: Hi everyone, thanks for joining today's call about the new client onboarding process.",
      "Sarah: Thanks for setting this up. I think we need to streamline our document verification steps.",
      "John: I agree. The current 7-step process is too cumbersome for clients.",
      "Mark: What if we reduce it to 3 key steps and automate the background verification?",
      "Sarah: That sounds promising. We could use our existing AI tools for that.",
      "John: Great point. Let's outline these 3 steps and create a plan to implement by end of month.",
      "Mark: I can draft the technical requirements for the automation part.",
      "Sarah: And I'll work on updating the client-facing instructions.",
      "John: Perfect. Let's meet again next week to review progress."
    ];
    
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < transcripts.length && isRecording) {
        setTranscription(prev => prev + transcripts[currentIndex] + "\n\n");
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 3000);
  };
  
  const generateSummary = () => {
    // Simulate AI processing delay
    setTimeout(() => {
      setSummary(
        "The team discussed streamlining the client onboarding process from 7 steps to 3 key steps with automated background verification. The goal is to implement these changes by the end of the month to improve client experience and operational efficiency."
      );
      
      setActionItems([
        "Mark to draft technical requirements for verification automation",
        "Sarah to update client-facing documentation",
        "Team to reconvene next week to review progress",
        "John to prepare implementation timeline"
      ]);
    }, 1500);
  };
  
  const saveNotes = () => {
    const notesToSave = {
      transcription,
      summary,
      actionItems
    };
    
    // In a real app, we would store this in a database
    setSavedNotes(prev => [...prev, notesToSave]);
    
    // Save to localStorage as well for persistence
    const existingNotes = JSON.parse(localStorage.getItem('meeting-notes') || '[]');
    const updatedNotes = [...existingNotes, {
      ...notesToSave,
      date: new Date().toISOString(),
      title: `Meeting Notes - ${new Date().toLocaleDateString()}`
    }];
    localStorage.setItem('meeting-notes', JSON.stringify(updatedNotes));
    
    toast({
      title: "Notes saved",
      description: "Meeting notes have been saved successfully.",
    });
  };

  // Use the new utility functions for exporting and printing
  const copyNotes = () => {
    copyToClipboard(transcription);
  };
  
  const printNotesHandler = () => {
    printNotes(transcription);
  };
  
  const exportPdf = () => {
    exportAsPdf(transcription, undefined, summary, actionItems);
  };
  
  const exportNotes = () => {
    exportAsText(transcription, undefined, summary, actionItems);
  };
  
  return {
    isRecording,
    transcription,
    summary,
    actionItems,
    activeTab,
    setActiveTab,
    toggleRecording,
    saveNotes,
    printNotes: printNotesHandler,
    exportPdf,
    exportNotes,
    copyNotes,
    contentRef
  };
};
