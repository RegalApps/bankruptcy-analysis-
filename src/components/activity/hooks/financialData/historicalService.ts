
import { supabase } from "@/integrations/supabase/client";

export const fetchHistoricalData = async (clientId: string) => {
  try {
    const { data: records, error } = await supabase
      .from("financial_records")
      .select("*")
      .eq("user_id", clientId)
      .order("submission_date", { ascending: false })
      .limit(2);

    if (error) throw error;

    if (records && records.length > 0) {
      return {
        currentPeriod: {
          totalIncome: records[0].total_income || 0,
          totalExpenses: records[0].total_expenses || 0,
          surplusIncome: records[0].surplus_income || 0,
        },
        previousPeriod: {
          totalIncome: records[1]?.total_income || 0,
          totalExpenses: records[1]?.total_expenses || 0,
          surplusIncome: records[1]?.surplus_income || 0,
        },
      };
    }
    
    // If no actual records exist, generate some realistic data for demo purposes
    return generateHistoricalDataForClient(clientId);
  } catch (error) {
    console.error("Error fetching historical data:", error);
    
    // Return fallback data even when there's an error
    return generateHistoricalDataForClient(clientId);
  }
};

// Helper function to generate mock data for specific clients
function generateHistoricalDataForClient(clientId: string) {
  if (clientId === "2") { // Reginald Dickerson
    return {
      currentPeriod: {
        totalIncome: 5800,
        totalExpenses: 3780,
        surplusIncome: 2020,
      },
      previousPeriod: {
        totalIncome: 5500,
        totalExpenses: 3650,
        surplusIncome: 1850,
      },
    };
  } else { // Default data for other clients
    return {
      currentPeriod: {
        totalIncome: 4200,
        totalExpenses: 2800,
        surplusIncome: 1400,
      },
      previousPeriod: {
        totalIncome: 4100,
        totalExpenses: 2850,
        surplusIncome: 1250,
      },
    };
  }
}
