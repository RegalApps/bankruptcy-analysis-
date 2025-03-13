
// This file is now just re-exporting from our new module structure
// to maintain backward compatibility

import {
  fetchPreviousMonthData,
  fetchLatestExcelData,
  submitFinancialRecord,
  fetchHistoricalData,
  mapDatabaseRecordToIncomeExpenseData
} from './financialData';

export {
  fetchPreviousMonthData,
  fetchLatestExcelData,
  submitFinancialRecord,
  fetchHistoricalData,
  mapDatabaseRecordToIncomeExpenseData
};
