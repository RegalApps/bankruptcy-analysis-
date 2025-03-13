
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { PrintableFormView } from "./PrintableFormView";
import { IncomeExpenseData } from "../types";
import { useReactToPrint } from "react-to-print";

interface PrintButtonProps {
  formData: IncomeExpenseData;
}

export const PrintButton = ({ formData }: PrintButtonProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  
  // Format date for form title
  const getFormattedDate = () => {
    const date = formData.submission_date 
      ? new Date(formData.submission_date) 
      : new Date();
    
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long'
    }).format(date);
  };
  
  const handlePrint = useReactToPrint({
    documentTitle: `Income_Expense_${formData.full_name}_${formData.submission_date}`,
    // Use the appropriate prop for the current version of react-to-print
    contentRef: printRef,
    onAfterPrint: () => {
      console.log("Printed successfully");
    },
  });

  return (
    <>
      <Button 
        onClick={() => handlePrint()} 
        variant="outline" 
        className="flex items-center gap-2"
      >
        <Printer className="h-4 w-4" />
        Print Form
      </Button>
      
      {/* Hidden printable version */}
      <div className="hidden">
        <PrintableFormView 
          ref={printRef} 
          formData={formData} 
          currentDate={getFormattedDate()}
        />
      </div>
    </>
  );
};
