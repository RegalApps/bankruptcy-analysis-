
import { jsPDF } from "jspdf";
import { toast } from "@/hooks/use-toast";
import 'jspdf-autotable';

export const printNotes = (content: string) => {
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
          <p>${content.replace(/\n/g, '<br>')}</p>
        </div>
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

export const exportAsPdf = (content: string, title?: string, summary?: string, actionItems?: string[]) => {
  try {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();
    
    // Add title
    doc.setFontSize(20);
    doc.text(`Meeting Notes - ${currentDate}`, 20, 20);
    
    // Add transcription
    if (content) {
      doc.setFontSize(16);
      doc.text('Transcription', 20, 40);
      doc.setFontSize(12);
      
      // Split text into lines that fit on the page
      const splitTranscription = doc.splitTextToSize(content, 170);
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
    if (actionItems && actionItems.length > 0) {
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

export const exportAsText = (content: string, title?: string, summary?: string, actionItems?: string[]) => {
  try {
    // Create a text file with all notes
    const currentDate = new Date().toLocaleDateString();
    let textContent = `MEETING NOTES - ${currentDate}\n\nTRANSCRIPTION:\n${content}\n\n`;
    
    if (summary) {
      textContent += `SUMMARY:\n${summary}\n\n`;
    }
    
    if (actionItems && actionItems.length > 0) {
      textContent += `ACTION ITEMS:\n${actionItems.map((item, i) => `${i + 1}. ${item}`).join('\n')}`;
    }
    
    // Create and download the text file
    const blob = new Blob([textContent], { type: 'text/plain' });
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

export const copyToClipboard = (content: string) => {
  navigator.clipboard.writeText(content);
  toast({
    title: "Copied to clipboard",
    description: "Meeting notes copied to clipboard successfully.",
  });
};
