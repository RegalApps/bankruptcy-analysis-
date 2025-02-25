
export const calculateMovingAverage = (data: any[], periods: number) => {
  if (!data?.length) return [];
  
  return data.map((record, index) => {
    if (index < periods - 1) return null;
    
    const window = data.slice(index - periods + 1, index + 1);
    const sum = window.reduce((acc, curr) => acc + curr.surplus_income, 0);
    return sum / periods;
  });
};

export const detectAnomalies = (data: any[]) => {
  if (!data?.length) return [];

  const surplusValues = data.map(record => record.surplus_income);
  const mean = surplusValues.reduce((a, b) => a + b, 0) / surplusValues.length;
  const stdDev = Math.sqrt(
    surplusValues.map(x => Math.pow(x - mean, 2))
      .reduce((a, b) => a + b, 0) / surplusValues.length
  );

  return data.map(record => {
    const zScore = Math.abs((record.surplus_income - mean) / stdDev);
    return {
      ...record,
      isAnomaly: zScore > 2,
      severity: zScore > 3 ? 'high' : 'medium'
    };
  });
};

export const calculateForecast = (data: any[], alpha: number = 0.3) => {
  if (!data?.length) return [];

  let forecast = [data[0].surplus_income];
  for (let i = 1; i < data.length; i++) {
    forecast[i] = alpha * data[i-1].surplus_income + (1 - alpha) * forecast[i-1];
  }

  // Add 6 months forecast
  for (let i = 0; i < 6; i++) {
    forecast.push(alpha * forecast[forecast.length - 1] + 
                 (1 - alpha) * forecast[forecast.length - 2]);
  }

  return forecast;
};

export const calculateSeasonalityScore = (data: any[]) => {
  const surplusValues = data.map(record => record.surplus_income);
  let correlation = 0;
  
  for (let i = 12; i < surplusValues.length; i++) {
    correlation += (surplusValues[i] - surplusValues[i - 12]) ** 2;
  }
  
  return (1 / (1 + correlation)).toFixed(2);
};

export const calculateTrend = (financialRecords: any[]) => {
  if (!financialRecords?.length) return "0";
  const recentRecords = financialRecords.slice(-2);
  if (recentRecords.length < 2) return "0";
  
  const change = recentRecords[1].surplus_income - recentRecords[0].surplus_income;
  return change.toFixed(2);
};
