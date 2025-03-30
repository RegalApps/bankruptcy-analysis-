
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

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
  
  const printNotes = () => {
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      const currentDate = new Date().toLocaleDateString();
      const content = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Meeting Notes - ${currentDate}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
            h1, h2 { color: #333; }
            .section { margin-bottom: 30px; }
            .action-item { margin: 10px 0; padding-left: 20px; position: relative; }
            .action-item:before { content: "•"; position: absolute; left: 0; }
          </style>
        </head>
        <body>
          <h1>Meeting Notes - ${currentDate}</h1>
          
          <div class="section">
            <h2>Transcription</h2>
            <p>${transcription.replace(/\n/g, '<br>')}</p>
          </div>
          
          ${summary ? `
          <div class="section">
            <h2>Summary</h2>
            <p>${summary}</p>
          </div>
          ` : ''}
          
          ${actionItems.length > 0 ? `
          <div class="section">
            <h2>Action Items</h2>
            ${actionItems.map(item => `<div class="action-item">${item}</div>`).join('')}
          </div>
          ` : ''}
        </body>
        </html>
      `;
      
      printWindow.document.open();
      printWindow.document.write(content);
      printWindow.document.close();
      
      // Wait for content to load then print
      printWindow.onload = function() {
        printWindow.print();
      };
    } else {
      toast({
        variant: "destructive",
        title: "Print failed",
        description: "Unable to open print window. Check your browser settings.",
      });
    }
    
    toast({
      title: "Print initiated",
      description: "Print dialog should appear shortly.",
    });
  };
  
  const exportPdf = () => {
    try {
      const doc = new jsPDF();
      const currentDate = new Date().toLocaleDateString();
      
      // Add title
      doc.setFontSize(20);
      doc.text(`Meeting Notes - ${currentDate}`, 20, 20);
      
      // Add transcription
      if (transcription) {
        doc.setFontSize(16);
        doc.text('Transcription', 20, 40);
        doc.setFontSize(12);
        
        // Split text into lines that fit on the page
        const splitTranscription = doc.splitTextToSize(transcription, 170);
        doc.text(splitTranscription, 20, 50);
      }
      
      // Add summary on a new page if needed
      if (summary) {
        doc.addPage();
        doc.setFontSize(16);
        doc.text('Summary', 20, 20);
        doc.setFontSize(12);
        const splitSummary = doc.splitTextToSize(summary, 170);
        doc.text(splitSummary, 20, 30);
      }
      
      // Add action items
      if (actionItems.length > 0) {
        doc.addPage();
        doc.setFontSize(16);
        doc.text('Action Items', 20, 20);
        doc.setFontSize(12);
        
        // Using jspdf-autotable for better formatting
        const tableData = actionItems.map((item, index) => [`${index + 1}`, item]);
        
        (doc as any).autoTable({
          startY: 30,
          head: [['No.', 'Task']],
          body: tableData,
          theme: 'grid',
          headStyles: { fillColor: [66, 139, 202] }
        });
      }
      
      // Save PDF
      doc.save(`meeting-notes-${currentDate.replace(/\//g, '-')}.pdf`);
      
      toast({
        title: "PDF exported",
        description: "Meeting notes have been exported as PDF.",
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "There was a problem generating the PDF.",
      });
    }
  };
  
  const exportNotes = () => {
    try {
      // Create a text file with all notes
      const currentDate = new Date().toLocaleDateString();
      const content = `
MEETING NOTES - ${currentDate}

TRANSCRIPTION:
${transcription}

${summary ? `SUMMARY:
${summary}

` : ''}${actionItems.length > 0 ? `ACTION ITEMS:
${actionItems.map((item, i) => `${i + 1}. ${item}`).join('\n')}` : ''}
`;
      
      // Create and download the text file
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meeting-notes-${currentDate.replace(/\//g, '-')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Notes exported",
        description: "Meeting notes have been exported as a text file.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "There was a problem exporting the notes.",
      });
    }
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
    printNotes,
    exportPdf,
    exportNotes,
    contentRef
  };
};
