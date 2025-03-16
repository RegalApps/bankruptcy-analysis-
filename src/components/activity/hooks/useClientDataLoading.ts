
import { useState, useEffect } from "react";
import { Client } from "../types";
import { initialFormData } from "./initialState";

export const useClientDataLoading = (
  selectedClient: Client | null,
  setFormData: React.Dispatch<React.SetStateAction<any>>,
  setCurrentRecordId: React.Dispatch<React.SetStateAction<string | null>>,
  setPreviousMonthData: React.Dispatch<React.SetStateAction<any>>,
  setHistoricalData: React.Dispatch<React.SetStateAction<any>>,
  setPeriodsData: React.Dispatch<React.SetStateAction<any>>,
  selectedPeriod: 'current' | 'previous'
) => {
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Load existing data when client changes
  useEffect(() => {
    const loadClientData = async () => {
      if (!selectedClient) return;
      
      setIsDataLoading(true);
      
      try {
        console.log("Loading financial data for client:", selectedClient.id);
        
        // Generate sample data for both periods
        const currentPeriodData = {
          ...initialFormData,
          full_name: selectedClient.name,
          
          // Monthly Income
          employment_income: "3800",
          pension_annuities: "800",
          government_benefits: "500",
          rental_income: "700",
          spouse_employment_income: "3200",
          total_monthly_income: "5800",
          spouse_total_monthly_income: "3200",
          
          // Essential Expenses
          mortgage_rent: "1500",
          utilities: "350",
          groceries: "600",
          child_care: "400",
          transportation: "300",
          debt_repayments: "450",
          total_essential_expenses: "3600",
          
          // Discretionary Expenses
          dining_out: "200",
          entertainment: "150",
          subscriptions: "50",
          clothing: "100",
          total_discretionary_expenses: "500",
          
          // Savings
          emergency_savings: "300",
          retirement_savings: "400",
          total_savings: "700",
          
          // Insurance
          vehicle_insurance: "120",
          home_insurance: "90",
          life_insurance: "60",
          total_insurance: "270",
          
          id: `current-${Date.now()}`
        };

        const previousPeriodData = {
          ...initialFormData,
          full_name: selectedClient.name,
          
          // Monthly Income
          employment_income: "3700",
          pension_annuities: "800",
          government_benefits: "500",
          rental_income: "700",
          spouse_employment_income: "3100",
          total_monthly_income: "5700",
          spouse_total_monthly_income: "3100",
          
          // Essential Expenses
          mortgage_rent: "1500",
          utilities: "340",
          groceries: "580",
          child_care: "400",
          transportation: "280",
          debt_repayments: "450",
          total_essential_expenses: "3550",
          
          // Discretionary Expenses
          dining_out: "180",
          entertainment: "150",
          subscriptions: "50",
          clothing: "90",
          total_discretionary_expenses: "470",
          
          // Savings
          emergency_savings: "300",
          retirement_savings: "400",
          total_savings: "700",
          
          // Insurance
          vehicle_insurance: "120",
          home_insurance: "90",
          life_insurance: "60",
          total_insurance: "270",
          
          id: `previous-${Date.now()}`
        };
        
        // Store periods data
        setPeriodsData({
          current: currentPeriodData,
          previous: previousPeriodData
        });
        
        // Set the current form data based on selected period
        if (selectedPeriod === 'current') {
          setFormData(currentPeriodData);
          setCurrentRecordId(currentPeriodData.id || null);
        } else {
          setFormData(previousPeriodData);
          setCurrentRecordId(previousPeriodData.id || null);
        }
        
        // Set previous month data for reference
        setPreviousMonthData(previousPeriodData);
        
        // Set historical data
        setHistoricalData({
          currentPeriod: {
            totalIncome: 9000,
            totalExpenses: 5070,
            surplusIncome: 3930
          },
          previousPeriod: {
            totalIncome: 8800,
            totalExpenses: 4990,
            surplusIncome: 3810
          }
        });
        
      } catch (error) {
        console.error('Error loading client data:', error);
      } finally {
        setIsDataLoading(false);
      }
    };
    
    loadClientData();
  }, [selectedClient, selectedPeriod, setFormData, setCurrentRecordId, setPreviousMonthData, setHistoricalData, setPeriodsData]);

  return {
    isDataLoading
  };
};
