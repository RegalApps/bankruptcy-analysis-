
import { supabase } from "@/integrations/supabase/client";
import { IncomeExpenseData } from "../types";
import { Database } from "@/integrations/supabase/types";

type FinancialRecord = Database["public"]["Tables"]["financial_records"]["Insert"];

export const fetchPreviousMonthData = async (clientId: string): Promise<IncomeExpenseData | null> => {
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const startOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
  const endOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);

  try {
    const { data, error } = await supabase
      .from("financial_records")
      .select("*")
      .eq("user_id", clientId)
      .gte("submission_date", startOfLastMonth.toISOString())
      .lte("submission_date", endOfLastMonth.toISOString())
      .order("submission_date", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching previous month data:", error);
      return null;
    }

    if (data) {
      return {
        monthly_income: data.monthly_income?.toString() || "",
        employment_income: data.employment_income?.toString() || "",
        other_income: data.other_income?.toString() || "",
        rent_mortgage: data.rent_mortgage?.toString() || "",
        utilities: data.utilities?.toString() || "",
        food: data.food?.toString() || "",
        transportation: data.transportation?.toString() || "",
        insurance: data.insurance?.toString() || "",
        medical_expenses: data.medical_expenses?.toString() || "",
        other_expenses: data.other_expenses?.toString() || "",
        income_frequency: "monthly",
        expense_frequency: "monthly",
        notes: data.notes || "",
        primary_salary: "",
        overtime_bonuses: "",
        freelance_income: "",
        investment_income: "",
        rental_income: "",
        electricity: "",
        gas: "",
        water: "",
        internet: "",
        groceries: "",
        dining_out: "",
        fuel: "",
        vehicle_maintenance: "",
      };
    }
    return null;
  } catch (error) {
    console.error("Error in fetchPreviousMonthData:", error);
    return null;
  }
};

export const submitFinancialRecord = async (
  financialRecord: FinancialRecord
): Promise<{ data: any; error: any }> => {
  return await supabase
    .from("financial_records")
    .insert([financialRecord])
    .select()
    .single();
};

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
    return null;
  } catch (error) {
    console.error("Error fetching historical data:", error);
    return null;
  }
};
