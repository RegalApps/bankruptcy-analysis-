
// Generate historical financial data
export const generateMockHistoricalData = () => {
  const today = new Date();
  const data = [];
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(today.getMonth() - i);
    
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    // Base values
    const monthlyIncome = 5000 + Math.random() * 1000;
    const baseExpenses = 3000 + Math.random() * 800;
    
    // Add seasonal variations
    const seasonalFactor = Math.sin((date.getMonth() / 12) * Math.PI * 2) * 300;
    
    const record = {
      id: `record-${i}`,
      submission_date: `${year}-${month}-${day}`,
      monthly_income: monthlyIncome + seasonalFactor,
      housing: 1500 + Math.random() * 100,
      utilities: 200 + Math.random() * 50 + (date.getMonth() >= 5 && date.getMonth() <= 8 ? 100 : 0), // Higher in summer
      food: 600 + Math.random() * 100,
      transportation: 300 + Math.random() * 50,
      healthcare: 200 + Math.random() * 30,
      debt_payments: 500 + Math.random() * 50,
      entertainment: 200 + Math.random() * 100,
      total_expenses: baseExpenses + seasonalFactor * 0.7,
      surplus_income: (monthlyIncome + seasonalFactor) - (baseExpenses + seasonalFactor * 0.7)
    };
    
    data.push(record);
  }
  
  return data;
};

// Generate forecast data
export const generateMockForecastData = (lastDate: Date) => {
  const data = [];
  
  for (let i = 1; i <= 6; i++) {
    const forecastDate = new Date(lastDate);
    forecastDate.setMonth(lastDate.getMonth() + i);
    
    const month = String(forecastDate.getMonth() + 1).padStart(2, '0');
    const year = forecastDate.getFullYear();
    
    // Base values with increasing uncertainty
    const uncertaintyFactor = 1 + (i * 0.05);
    const monthlyIncome = (5000 + Math.random() * 1000 * uncertaintyFactor);
    const baseExpenses = (3000 + Math.random() * 800 * uncertaintyFactor);
    
    // Add seasonal variations
    const seasonalFactor = Math.sin((forecastDate.getMonth() / 12) * Math.PI * 2) * 300;
    
    const surplusIncome = (monthlyIncome + seasonalFactor) - (baseExpenses + seasonalFactor * 0.7);
    
    const record = {
      id: `forecast-${i}`,
      submission_date: `${year}-${month}-15`,
      monthly_income: monthlyIncome + seasonalFactor,
      total_expenses: baseExpenses + seasonalFactor * 0.7,
      surplus_income: surplusIncome,
      isForecast: true,
      confidence: Math.max(30, 100 - (i * 10)), // Decreasing confidence as we forecast further
      rangeMin: surplusIncome * 0.8,
      rangeMax: surplusIncome * 1.2
    };
    
    data.push(record);
  }
  
  return data;
};

// Generate metrics for the dashboard
export const generateMockMetrics = () => {
  const riskLevels = ["Low", "Medium", "High"];
  const riskLevel = riskLevels[Math.floor(Math.random() * 3)];
  
  return {
    currentSurplus: (1000 + Math.random() * 3000).toFixed(2),
    surplusPercentage: (10 + Math.random() * 40).toFixed(1),
    monthlyTrend: (Math.random() * 400 - 200).toFixed(2),
    riskLevel,
    seasonalityScore: (0.1 + Math.random() * 0.8).toFixed(2)
  };
};

// Generate category analysis data
export const generateMockCategoryAnalysis = () => {
  return [
    {
      name: "Housing",
      value: 1500 + Math.random() * 200,
      percentage: 30 + Math.random() * 5,
      color: "#8884d8"
    },
    {
      name: "Utilities",
      value: 200 + Math.random() * 50,
      percentage: 5 + Math.random() * 2,
      color: "#82ca9d"
    },
    {
      name: "Food",
      value: 600 + Math.random() * 100,
      percentage: 15 + Math.random() * 3,
      color: "#ffc658"
    },
    {
      name: "Transportation",
      value: 300 + Math.random() * 50,
      percentage: 8 + Math.random() * 2,
      color: "#ff8042"
    },
    {
      name: "Healthcare",
      value: 200 + Math.random() * 50,
      percentage: 5 + Math.random() * 2,
      color: "#a4de6c"
    },
    {
      name: "Debt Payments",
      value: 500 + Math.random() * 100,
      percentage: 12 + Math.random() * 3,
      color: "#d0ed57"
    },
    {
      name: "Entertainment",
      value: 200 + Math.random() * 100,
      percentage: 5 + Math.random() * 3,
      color: "#83a6ed"
    }
  ];
};

// Generate advanced risk metrics and opportunity data
export const generateAdvancedRiskMetrics = (clientName: string) => {
  const riskScores = {
    creditUtilization: Math.floor(Math.random() * 100),
    debtToIncome: Math.floor(Math.random() * 100),
    emergencyFund: Math.floor(Math.random() * 100),
    incomeStability: Math.floor(Math.random() * 100),
    expenseVolatility: Math.floor(Math.random() * 100)
  };
  
  // Calculate overall risk level
  const averageRiskScore = Object.values(riskScores).reduce((a: any, b: any) => a + b, 0) / 5;
  let riskLevel = 'low';
  if (averageRiskScore > 70) {
    riskLevel = 'high';
  } else if (averageRiskScore > 40) {
    riskLevel = 'medium';
  }
  
  // Generate random risk factors
  const riskFactors = [
    "High credit utilization ratio",
    "Insufficient emergency fund",
    "Income volatility",
    "High debt-to-income ratio",
    "Increasing essential expenses",
    "Inconsistent savings rate"
  ];
  
  // Generate random opportunities
  const opportunityTypes = [
    {
      title: "Debt Consolidation Opportunity",
      description: "Based on current interest rates and credit profile, consolidating high-interest debts could save approximately $2,400 annually.",
      potentialSavings: "$2,400/year",
      confidence: "85%",
      type: "saving"
    },
    {
      title: "Refinancing Opportunity",
      description: "Current mortgage rates are 1.2% lower than your existing rate. Refinancing could reduce monthly payments by $350.",
      potentialSavings: "$4,200/year",
      confidence: "90%",
      type: "saving"
    },
    {
      title: "Tax Optimization",
      description: "Analysis indicates potential for additional tax deductions worth approximately $1,800 through optimized filing strategies.",
      potentialSavings: "$1,800/year",
      confidence: "75%",
      type: "saving"
    },
    {
      title: "Expense Reduction",
      description: "Identified potential savings in utility and subscription services that could reduce monthly expenses by $120.",
      potentialSavings: "$1,440/year",
      confidence: "95%",
      type: "saving"
    },
    {
      title: "Income Diversification",
      description: "Based on your skills and market trends, there are opportunities to establish additional income streams of $500-1000 monthly.",
      potentialGains: "$6,000-12,000/year",
      confidence: "65%",
      type: "growth"
    }
  ];
  
  // Select random subset of opportunities
  const shuffledOpportunities = [...opportunityTypes].sort(() => 0.5 - Math.random());
  const selectedOpportunities = shuffledOpportunities.slice(0, 2 + Math.floor(Math.random() * 3));
  
  // Select primary risk factor based on risk level
  let primaryRiskFactor = "";
  if (riskLevel === 'high') {
    primaryRiskFactor = riskFactors[Math.floor(Math.random() * 3)];
  } else if (riskLevel === 'medium') {
    primaryRiskFactor = riskFactors[3 + Math.floor(Math.random() * 2)];
  } else {
    primaryRiskFactor = "No significant risk factors identified";
  }
  
  return {
    riskLevel,
    overallRiskScore: Math.floor(averageRiskScore),
    primaryRiskFactor,
    detailedRiskScores: riskScores,
    opportunities: selectedOpportunities,
    improvementSuggestions: [
      "Establish an emergency fund covering 3-6 months of expenses",
      "Reduce credit card utilization to below 30%",
      "Consider income protection insurance",
      "Develop a debt reduction strategy focusing on high-interest debt first",
      "Set up automatic savings transfers on payday"
    ].slice(0, 3 + Math.floor(Math.random() * 2)),
    scenarioAnalysis: {
      bestCase: {
        surplusIncrease: `${(Math.random() * 15 + 15).toFixed(1)}%`,
        debtReduction: `${(Math.random() * 20 + 20).toFixed(1)}%`,
        timeFrame: "12 months"
      },
      worstCase: {
        surplusDecrease: `${(Math.random() * 20 + 10).toFixed(1)}%`,
        debtIncrease: `${(Math.random() * 15 + 5).toFixed(1)}%`,
        recoveryTime: "18-24 months"
      }
    },
    clientName
  };
};
