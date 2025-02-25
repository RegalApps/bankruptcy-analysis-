
import { IncomeExpenseData, Client } from "../types";

export interface HistoricalData {
  currentPeriod: {
    totalIncome: number;
    totalExpenses: number;
    surplusIncome: number;
  };
  previousPeriod: {
    totalIncome: number;
    totalExpenses: number;
    surplusIncome: number;
  };
}

export interface UseIncomeExpenseFormReturn {
  formData: IncomeExpenseData;
  isSubmitting: boolean;
  selectedClient: Client | null;
  currentRecordId: string | null;
  historicalData: HistoricalData;
  previousMonthData: IncomeExpenseData | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleFrequencyChange: (type: 'income' | 'expense') => (value: string) => void;
  handleClientSelect: (clientId: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}
