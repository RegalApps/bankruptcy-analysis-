
// Generate mock historical and forecast data for the predictive analysis
export const generateMockHistoricalData = () => {
  return [
    {
      submission_date: "2024-01-15",
      surplus_income: 3700,
      total_expenses: 4800,
      total_income: 8500,
      isForecast: false,
      isAnomaly: false
    },
    {
      submission_date: "2024-02-15",
      surplus_income: 3700,
      total_expenses: 4900,
      total_income: 8600,
      isForecast: false,
      isAnomaly: false
    },
    {
      submission_date: "2024-03-15",
      surplus_income: 3750,
      total_expenses: 4950,
      total_income: 8700,
      isForecast: false,
      isAnomaly: false
    },
    {
      submission_date: "2024-04-15",
      surplus_income: 3810,
      total_expenses: 4990,
      total_income: 8800,
      isForecast: false,
      isAnomaly: false
    },
    {
      submission_date: "2024-05-15",
      surplus_income: 3930,
      total_expenses: 5070,
      total_income: 9000,
      isForecast: false,
      isAnomaly: false
    }
  ];
};

export const generateMockForecastData = (lastDate: Date) => {
  return Array.from({ length: 6 }, (_, i) => {
    const futureDate = new Date(lastDate);
    futureDate.setMonth(lastDate.getMonth() + i + 1);
    
    // Calculate a slightly increasing forecast value
    const forecastValue = 3950 + (i * 50);
    
    // Add some small variation for the 4th prediction
    const value = i === 4 ? forecastValue - 20 : forecastValue;
    
    return {
      submission_date: futureDate.toISOString(),
      forecast: value,
      isForecast: true,
      isAnomaly: false
    };
  });
};

export const generateMockMetrics = () => {
  return {
    currentSurplus: "3930.00",
    surplusPercentage: "43.7",
    monthlyTrend: "120.00",
    riskLevel: "Low",
    seasonalityScore: 24.5
  };
};

export const generateMockCategoryAnalysis = () => {
  return [
    { name: "Essential Expenses", value: 3600, percentage: 71.0, color: "#8884d8" },
    { name: "Discretionary Expenses", value: 500, percentage: 9.9, color: "#82ca9d" },
    { name: "Savings & Investments", value: 700, percentage: 13.8, color: "#ffc658" },
    { name: "Insurance", value: 270, percentage: 5.3, color: "#ff8042" }
  ];
};
