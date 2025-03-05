
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import logger from "@/utils/logger";
import { ExcelData } from "../types";

export const useExcelPreview = (storagePath: string, title?: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [excelData, setExcelData] = useState<ExcelData>({ headers: [], rows: [] });
  
  const publicUrl = supabase.storage.from('documents').getPublicUrl(storagePath).data.publicUrl;
  
  const fetchExcelPreview = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // For demonstration purposes, we'll generate a simulated Excel preview
      // In a real app, you could use a backend service to extract actual Excel data
      
      // Generate fake headers and data based on file name
      const isFinancial = title?.toLowerCase().includes('financial') || 
                         title?.toLowerCase().includes('income') || 
                         title?.toLowerCase().includes('expense');
      
      const isReginaldDickerson = title?.toLowerCase().includes('reginald') || 
                               title?.toLowerCase().includes('dickerson');
                               
      // Generate headers based on document type
      let simulatedHeaders: string[] = [];
      let simulatedData: any[][] = [];
      
      if (isFinancial) {
        simulatedHeaders = ['Category', 'January', 'February', 'March', 'April', 'May', 'June'];
        
        if (isReginaldDickerson) {
          simulatedData = [
            ['Salary', '$4,500', '$4,500', '$4,500', '$4,800', '$4,800', '$4,800'],
            ['Bonus', '$0', '$300', '$0', '$0', '$500', '$0'],
            ['Investment Income', '$100', '$120', '$95', '$105', '$110', '$125'],
            ['Rent', '$1,600', '$1,600', '$1,600', '$1,600', '$1,600', '$1,600'],
            ['Utilities', '$380', '$350', '$320', '$290', '$310', '$340'],
            ['Food', '$750', '$720', '$780', '$710', '$800', '$730'],
            ['Transportation', '$420', '$410', '$430', '$450', '$440', '$460'],
            ['Insurance', '$280', '$280', '$280', '$280', '$280', '$280'],
            ['Medical', '$150', '$0', '$220', '$0', '$100', '$0'],
            ['Other Expenses', '$200', '$180', '$230', '$190', '$210', '$195'],
            ['Net Income', '$820', '$1,380', '$735', '$1,385', '$1,470', '$1,320']
          ];
        } else {
          simulatedData = [
            ['Salary', '$3,500', '$3,500', '$3,500', '$3,500', '$3,700', '$3,700'],
            ['Bonus', '$0', '$200', '$0', '$0', '$0', '$300'],
            ['Other Income', '$300', '$300', '$300', '$300', '$300', '$300'],
            ['Rent', '$1,200', '$1,200', '$1,200', '$1,200', '$1,300', '$1,300'],
            ['Utilities', '$250', '$240', '$230', '$200', '$210', '$220'],
            ['Food', '$600', '$580', '$620', '$590', '$630', '$600'],
            ['Transportation', '$300', '$320', '$290', '$310', '$320', '$330'],
            ['Insurance', '$200', '$200', '$200', '$200', '$200', '$200'],
            ['Medical', '$100', '$0', '$150', '$0', '$80', '$0'],
            ['Other Expenses', '$150', '$140', '$160', '$140', '$170', '$160'],
            ['Net Income', '$1,000', '$1,320', '$950', '$1,160', '$1,090', '$1,490']
          ];
        }
      } else {
        simulatedHeaders = ['Item', 'Quantity', 'Unit Price', 'Total'];
        simulatedData = [
          ['Product A', '5', '$10.00', '$50.00'],
          ['Product B', '3', '$15.00', '$45.00'],
          ['Product C', '2', '$25.00', '$50.00'],
          ['Product D', '1', '$30.00', '$30.00'],
          ['Product E', '4', '$12.50', '$50.00'],
          ['Total', '', '', '$225.00']
        ];
      }
      
      setExcelData({
        headers: simulatedHeaders,
        rows: simulatedData
      });
    } catch (err) {
      logger.error('Error generating Excel preview:', err);
      setError('Could not generate preview for this Excel file');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchExcelPreview();
  }, [storagePath, title]);
  
  return {
    loading,
    error,
    excelData,
    publicUrl,
    fetchExcelPreview
  };
};
