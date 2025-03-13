
import { supabase } from "@/integrations/supabase/client";
import { IncomeExpenseData } from "../../types";
import { mapDatabaseRecordToIncomeExpenseData } from "./mappers";

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
      return mapDatabaseRecordToIncomeExpenseData(data);
    }
    return null;
  } catch (error) {
    console.error("Error in fetchPreviousMonthData:", error);
    return null;
  }
};
