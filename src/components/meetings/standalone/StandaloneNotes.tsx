
import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FileText, Save, Copy, Printer, FileArrowDown } from "lucide-react";
import { jsPDF } from "jspdf";

export const StandaloneNotes = () => {
  const [notes, setNotes] = React.useState<string>("");
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
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
    navigator.clipboard.writeText(notes);
    toast({
      title: "Copied to clipboard",
      description: "Meeting notes copied to clipboard successfully",
    });
  };
  
  const handlePrintNotes = () => {
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
            h1 { color: #333; }
            .notes { white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <h1>Meeting Notes - ${currentDate}</h1>
          <div class="notes">${notes.replace(/\n/g, '<br>')}</div>
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
      
      toast({
        title: "Print initiated",
        description: "Print dialog should appear shortly.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Print failed",
        description: "Unable to open print window. Check your browser settings.",
      });
    }
  };
  
  const handleExportPdf = () => {
    try {
      const doc = new jsPDF();
      const currentDate = new Date().toLocaleDateString();
      
      // Add title
      doc.setFontSize(18);
      doc.text(`Meeting Notes - ${currentDate}`, 20, 20);
      
      // Add notes content
      doc.setFontSize(12);
      const splitNotes = doc.splitTextToSize(notes, 170);
      doc.text(splitNotes, 20, 30);
      
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
  
  const handleExportText = () => {
    try {
      // Create a text file with the notes
      const currentDate = new Date().toLocaleDateString();
      
      // Create and download the text file
      const blob = new Blob([notes], { type: 'text/plain' });
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
  
  return (
    <div className="p-4 min-h-screen flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Meeting Notes
          </CardTitle>
          <div className="flex gap-2 flex-wrap">
            <Button 
              size="sm"
              variant="outline"
              onClick={handleCopyNotes}
              className="flex items-center gap-1"
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            
            <Button 
              size="sm"
              variant="outline"
              onClick={handlePrintNotes}
              className="flex items-center gap-1"
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
            
            <Button 
              size="sm"
              variant="outline"
              onClick={handleExportPdf}
              className="flex items-center gap-1"
            >
              <FileArrowDown className="h-4 w-4" />
              PDF
            </Button>
            
            <Button 
              size="sm"
              variant="outline"
              onClick={handleExportText}
              className="flex items-center gap-1"
            >
              <FileText className="h-4 w-4" />
              Text
            </Button>
            
            <Button 
              size="sm"
              onClick={handleSaveNotes}
              className="flex items-center gap-1"
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <Textarea
            ref={textareaRef}
            value={notes}
            onChange={handleNotesChange}
            placeholder="Type your meeting notes here..."
            className="h-full min-h-[calc(100vh-120px)] resize-none rounded-t-none border-x-0 border-b-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </CardContent>
      </Card>
    </div>
  );
};
