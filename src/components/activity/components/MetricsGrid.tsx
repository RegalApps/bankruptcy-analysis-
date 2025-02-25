
import { MetricCard } from "@/components/analytics/MetricCard";
import { TrendingUp, AlertTriangle, DollarSign, LineChart as ChartIcon } from "lucide-react";

interface MetricsGridProps {
  metrics: {
    currentSurplus: string;
    surplusPercentage: string;
    monthlyTrend: string;
    riskLevel: string;
  } | null;
}

export const MetricsGrid = ({ metrics }: MetricsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Current Surplus Income"
        value={`$${metrics?.currentSurplus || '0'}`}
        description="Available funds after expenses"
        icon={DollarSign}
      />
      <MetricCard
        title="Surplus Percentage"
        value={`${metrics?.surplusPercentage || '0'}%`}
        description="Of total monthly income"
        icon={TrendingUp}
      />
      <MetricCard
        title="Monthly Trend"
        value={`$${metrics?.monthlyTrend || '0'}`}
        description="Change from previous month"
        icon={ChartIcon}
      />
      <MetricCard
        title="Risk Level"
        value={metrics?.riskLevel || 'N/A'}
        description="Based on surplus threshold"
        icon={AlertTriangle}
      />
    </div>
  );
};
