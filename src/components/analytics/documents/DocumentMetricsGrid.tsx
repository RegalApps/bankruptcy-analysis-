
import { Activity, Clock, AlertTriangle } from "lucide-react";
import { MetricCard } from "../MetricCard";

export const DocumentMetricsGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <MetricCard
        title="Task Volume"
        value="320"
        description="+12% from last month"
        icon={Activity}
      />
      <MetricCard
        title="Time Saved"
        value="87 hours"
        description="This quarter"
        icon={Clock}
      />
      <MetricCard
        title="Error Reduction"
        value="-65%"
        description="Year over year"
        icon={AlertTriangle}
      />
    </div>
  );
};
