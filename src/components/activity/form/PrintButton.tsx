
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
  
  // Generate AI summary based on financial data
  const generateAISummary = () => {
    // Calculate surplus/deficit
    const totalIncome = parseFloat(formData.total_monthly_income) + 
                        parseFloat(formData.spouse_total_monthly_income || "0");
    const totalExpenses = parseFloat(formData.total_essential_expenses) + 
                         parseFloat(formData.total_discretionary_expenses) + 
                         parseFloat(formData.total_savings) + 
                         parseFloat(formData.total_insurance);
    const surplus = totalIncome - totalExpenses;
    
    // Calculate debt ratio
    const debtPayments = parseFloat(formData.debt_repayments || "0");
    const debtRatio = (debtPayments / totalIncome) * 100;
    
    // Identify high risk categories
    const highRiskCategories = [];
    
    // Check housing costs (should be under 35% of income)
    const housingCost = parseFloat(formData.mortgage_rent || "0");
    if ((housingCost / totalIncome) > 0.35) {
      highRiskCategories.push("Housing costs exceed 35% of income");
    }
    
    // Check debt payments (should be under 20% of income)
    if ((debtPayments / totalIncome) > 0.2) {
      highRiskCategories.push("Debt payments exceed 20% of income");
    }
    
    // Check discretionary vs essential ratio
    const discretionaryTotal = parseFloat(formData.total_discretionary_expenses || "0");
    const essentialTotal = parseFloat(formData.total_essential_expenses || "0");
    if (discretionaryTotal > (essentialTotal * 0.4)) {
      highRiskCategories.push("Discretionary spending is high relative to essentials");
    }
    
    // Determine trend
    const trend = surplus >= 0 ? "positive" : "negative";
    
    return {
      surplusDeficit: {
        amount: surplus.toFixed(2),
        trend: trend
      },
      debtRatio: debtRatio.toFixed(1),
      highRiskCategories: highRiskCategories,
      trusteeNotes: "Client should focus on reducing discretionary expenses and building emergency savings."
    };
  };
  
  const handlePrint = useReactToPrint({
    documentTitle: `Income_Expense_${formData.full_name}_${formData.submission_date}`,
    contentRef: printRef,
    onAfterPrint: () => {
      console.log("Printed successfully");
    },
  });

  const aiSummary = generateAISummary();

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
          aiSummary={aiSummary}
        />
      </div>
    </>
  );
};
