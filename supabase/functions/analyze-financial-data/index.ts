
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const validateFinancialData = (data: any) => {
  const validation = {
    errors: [],
    warnings: [],
    suggestions: [],
  };

  // Basic validation rules
  if (data.monthly_income < 0) {
    validation.errors.push('Monthly income cannot be negative');
  }

  if (data.total_expenses > data.monthly_income * 0.9) {
    validation.warnings.push('Expenses are over 90% of income');
  }

  // Industry standard checks
  const standardRatios = {
    housing: 0.33, // 33% of income
    transportation: 0.15,
    food: 0.15,
  };

  const housingRatio = data.rent_mortgage / data.monthly_income;
  if (housingRatio > standardRatios.housing) {
    validation.warnings.push(`Housing expenses (${(housingRatio * 100).toFixed(1)}%) exceed recommended ratio (${standardRatios.housing * 100}%)`);
  }

  return validation;
};

const detectAnomalies = (currentData: any, historicalData: any[]) => {
  const anomalies = [];
  const threshold = 0.25; // 25% change

  if (historicalData.length > 0) {
    const lastMonth = historicalData[0];
    
    // Compare key metrics
    const metrics = [
      { name: 'monthly_income', label: 'Monthly Income' },
      { name: 'rent_mortgage', label: 'Housing Expenses' },
      { name: 'food', label: 'Food Expenses' },
      { name: 'transportation', label: 'Transportation' },
    ];

    metrics.forEach(metric => {
      const current = parseFloat(currentData[metric.name]);
      const previous = parseFloat(lastMonth[metric.name]);
      
      if (previous > 0) {
        const change = (current - previous) / previous;
        if (Math.abs(change) > threshold) {
          anomalies.push({
            field: metric.label,
            change: (change * 100).toFixed(1) + '%',
            severity: Math.abs(change) > 0.5 ? 'high' : 'medium',
          });
        }
      }
    });
  }

  return anomalies;
};

const predictTrends = (historicalData: any[]) => {
  if (historicalData.length < 3) return null;

  const predictions = {
    surplus_income: [],
    expense_growth: [],
    risk_factors: [],
  };

  // Simple moving average for surplus income trend
  const surplusHistory = historicalData.map(record => 
    parseFloat(record.monthly_income) - parseFloat(record.total_expenses)
  );

  const avgSurplus = surplusHistory.reduce((a, b) => a + b, 0) / surplusHistory.length;
  const trend = surplusHistory[surplusHistory.length - 1] - surplusHistory[0];

  predictions.surplus_income = {
    trend: trend > 0 ? 'increasing' : 'decreasing',
    average: avgSurplus,
    next_month_estimate: avgSurplus + (trend / surplusHistory.length),
  };

  // Risk assessment
  if (avgSurplus < 0) {
    predictions.risk_factors.push('Negative average surplus income');
  }
  if (trend < 0) {
    predictions.risk_factors.push('Declining surplus income trend');
  }

  return predictions;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { financial_record_id, current_data, historical_data } = await req.json();
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Perform analysis
    const validation = validateFinancialData(current_data);
    const anomalies = detectAnomalies(current_data, historical_data);
    const predictions = predictTrends(historical_data);

    // Store analysis results
    const { error } = await supabase
      .from('financial_analysis')
      .upsert({
        financial_record_id,
        validation_results: validation,
        predicted_trends: predictions,
        anomaly_scores: anomalies,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;

    return new Response(
      JSON.stringify({
        validation,
        anomalies,
        predictions,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
