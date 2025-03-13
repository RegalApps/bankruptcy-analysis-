
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type FinancialRecord = Database["public"]["Tables"]["financial_records"]["Insert"];

export const submitFinancialRecord = async (
  financialRecord: FinancialRecord
): Promise<{ data: any; error: any }> => {
  return await supabase
    .from("financial_records")
    .insert([financialRecord])
    .select()
    .single();
};
