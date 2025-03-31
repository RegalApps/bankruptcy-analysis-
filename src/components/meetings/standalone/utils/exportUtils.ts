
import { jsPDF } from "jspdf";
import { toast } from "@/hooks/use-toast";

export const copyToClipboard = (notes: string) => {
  navigator.clipboard.writeText(notes);
  toast({
    description: "Meeting notes copied to clipboard successfully",
  });
};

export const printNotes = (notes: string) => {
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
      description: "Print dialog should appear shortly.",
    });
  } else {
    toast({
      description: "Unable to open print window. Check your browser settings.",
      variant: "destructive",
    });
  }
};

export const exportAsPdf = (notes: string) => {
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
      description: "Meeting notes have been exported as PDF.",
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    toast({
      description: "There was a problem generating the PDF.",
      variant: "destructive",
    });
  }
};

export const exportAsText = (notes: string) => {
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
      description: "Meeting notes have been exported as a text file.",
    });
  } catch (error) {
    console.error('Export error:', error);
    toast({
      description: "There was a problem exporting the notes.",
      variant: "destructive",
    });
  }
};
