
import { Client, IncomeExpenseData } from "../types";

export type PeriodType = 'current' | 'previous';

export interface UseIncomeExpenseFormReturn {
  formData: IncomeExpenseData;
  isSubmitting: boolean;
  selectedClient: Client | null;
  currentRecordId: string | null;
  historicalData: {
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
  };
  previousMonthData: IncomeExpenseData | null;
  selectedPeriod: PeriodType;
  isDataLoading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleFrequencyChange: (type: 'income' | 'expense') => (value: string) => void;
  handleClientSelect: (clientId: string) => Promise<void>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handlePeriodChange: (period: PeriodType) => void;
}
