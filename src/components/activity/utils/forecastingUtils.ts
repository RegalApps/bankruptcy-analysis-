
import { calculateSeasonalityScore, calculateTrend, detectAnomalies, calculateForecast } from "./financialCalculations";
import { toast } from "sonner";

export const processForecastData = (financialRecords: any[], selectedClient: any | null) => {
  if (!financialRecords?.length) return [];
  
  const anomalies = detectAnomalies(financialRecords);
  const forecast = calculateForecast(financialRecords);
  
  // Only show anomaly notifications if client is selected
  if (selectedClient) {
    anomalies.forEach((record) => {
      if (record.isAnomaly) {
        const severity = record.severity === 'high' ? 'error' : 'warning';
        const message = `Anomaly detected for ${selectedClient.name}: Unusual surplus income on ${new Date(record.submission_date).toLocaleDateString()}`;
        
        if (severity === 'error') {
          toast.error(message, { duration: 5000 });
        } else {
          toast.warning(message, { duration: 5000 });
        }
      }
    });
  }

  // Add 6 months of future dates for forecast
  const lastRecord = financialRecords[financialRecords.length - 1];
  const lastDate = new Date(lastRecord.submission_date);
  
  const futureData = Array.from({ length: 6 }, (_, i) => {
    const futureDate = new Date(lastDate);
    futureDate.setMonth(lastDate.getMonth() + i + 1);
    return {
      submission_date: futureDate.toISOString(),
      forecast: forecast[forecast.length - 6 + i],
      isForecast: true
    };
  });

  return [...anomalies.map((record, index) => ({
    ...record,
    forecast: forecast[index]
  })), ...futureData];
};

export const calculateFinancialMetrics = (financialRecords: any[], selectedClient: any | null) => {
  if (!financialRecords?.length) return null;
  
  const latestRecord = financialRecords[financialRecords.length - 1];
  const surplusIncome = latestRecord.surplus_income || 
                       (latestRecord.monthly_income - latestRecord.total_expenses) || 0;
                       
  const totalIncome = latestRecord.total_income || latestRecord.monthly_income || 0;
  const surplusPercentage = ((surplusIncome / totalIncome) * 100).toFixed(1);

  const seasonalityScore = financialRecords.length >= 12 ? 
    calculateSeasonalityScore(financialRecords) : null;

  const riskLevel = surplusIncome < 0 ? "High" : surplusIncome < 1000 ? "Medium" : "Low";
  
  // Only show risk level toast if client is selected
  if (selectedClient) {
    if (riskLevel === "High") {
      toast.error(`High Risk Alert for ${selectedClient.name}: Negative surplus income detected`, {
        duration: 5000,
      });
    } else if (riskLevel === "Medium") {
      toast.warning(`Medium Risk Alert for ${selectedClient.name}: Low surplus income detected`, {
        duration: 5000,
      });
    }
  }

  return {
    currentSurplus: surplusIncome.toFixed(2),
    surplusPercentage,
    monthlyTrend: calculateTrend(financialRecords),
    riskLevel,
    seasonalityScore
  };
};
