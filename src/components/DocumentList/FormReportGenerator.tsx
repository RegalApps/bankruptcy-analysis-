
import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const FormReportGenerator: React.FC = () => {
  const { toast } = useToast();

  const generateReport = async () => {
    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(18);
      doc.text('OSB Forms Risk Assessment Report', 14, 20);
      
      // Subtitle
      doc.setFontSize(12);
      doc.text('Comprehensive Analysis of Forms 1-96', 14, 30);
      
      let yPos = 40;
      const pageHeight = doc.internal.pageSize.height;
      
      // Form Data
      const forms = [
        {
          number: "72",
          title: "Notice of Appointment of Receiver",
          purpose: "Documents initial receiver appointment",
          risks: [
            {
              area: "BIA 243(1) Notice Timing",
              threshold: "Maximum 10 days allowed",
              solution: "Automated timeline tracking with early warnings"
            }
          ],
          requirements: [
            "Appointment basis",
            "Security instrument details",
            "Secured creditor notice"
          ]
        },
        {
          number: "73",
          title: "Statement of Receiver",
          purpose: "Initial receiver reporting",
          risks: [
            {
              area: "BIA 246(2) Report Filing",
              threshold: "Maximum 30 days for initial report",
              solution: "Property inventory tracking system"
            }
          ],
          requirements: [
            "Complete property inventory",
            "Realization plan",
            "Financial projections"
          ]
        },
        // ... Add more forms here
      ];
      
      forms.forEach((form) => {
        // Check if we need a new page
        if (yPos > pageHeight - 40) {
          doc.addPage();
          yPos = 20;
        }
        
        // Form header
        doc.setFontSize(14);
        doc.text(`Form ${form.number} - ${form.title}`, 14, yPos);
        yPos += 10;
        
        // Purpose
        doc.setFontSize(12);
        doc.text(`Purpose: ${form.purpose}`, 14, yPos);
        yPos += 10;
        
        // Risks
        doc.text('Risk Assessment:', 14, yPos);
        yPos += 7;
        form.risks.forEach((risk) => {
          doc.setFontSize(10);
          doc.text(`• ${risk.area}`, 20, yPos);
          yPos += 5;
          doc.text(`  Threshold: ${risk.threshold}`, 20, yPos);
          yPos += 5;
          doc.text(`  Solution: ${risk.solution}`, 20, yPos);
          yPos += 7;
        });
        
        // Requirements
        doc.setFontSize(12);
        doc.text('Required Documentation:', 14, yPos);
        yPos += 7;
        form.requirements.forEach((req) => {
          doc.setFontSize(10);
          doc.text(`• ${req}`, 20, yPos);
          yPos += 5;
        });
        
        yPos += 15; // Space between forms
      });
      
      // Save the PDF
      doc.save('osb-forms-risk-assessment.pdf');
      
      toast({
        title: "Report Generated",
        description: "The OSB Forms Risk Assessment report has been downloaded.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate the report. Please try again.",
        duration: 3000,
      });
    }
  };

  return (
    <Button
      onClick={generateReport}
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      Generate Forms Report
    </Button>
  );
};
