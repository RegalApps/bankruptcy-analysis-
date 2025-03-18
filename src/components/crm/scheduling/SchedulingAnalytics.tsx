
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { MeetingEfficiencyReport } from "./analytics/MeetingEfficiencyReport";
import { ClientEngagementScores } from "./analytics/ClientEngagementScores";
import { TrusteeWorkloadDistribution } from "./analytics/TrusteeWorkloadDistribution";
import { TimeAllocationInsights } from "./analytics/TimeAllocationInsights";
import { SchedulingMetricsGrid } from "./analytics/SchedulingMetricsGrid";
import { 
  useMeetingEfficiencyData,
  useClientEngagementData,
  useTrusteeWorkloadData,
  useTimeAllocationData
} from "./analytics/hooks/useAnalyticsData";

export const SchedulingAnalytics = () => {
  const meetingEfficiencyData = useMeetingEfficiencyData();
  const clientEngagementData = useClientEngagementData();
  const trusteeWorkloadData = useTrusteeWorkloadData();
  const timeAllocationData = useTimeAllocationData();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Advanced Scheduling Analytics & AI Insights</h2>
        <p className="text-muted-foreground mb-6">
          Comprehensive analysis of your scheduling patterns, client engagement, and staff workload to optimize your firm's operations.
        </p>
      </div>

      {/* Quick metrics overview */}
      <SchedulingMetricsGrid />

      {/* Meeting Efficiency Report */}
      <MeetingEfficiencyReport data={meetingEfficiencyData} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Engagement Scores */}
        <ClientEngagementScores data={clientEngagementData} />

        {/* Trustee Workload Distribution */}
        <TrusteeWorkloadDistribution data={trusteeWorkloadData} />
      </div>

      {/* Time Allocation Insights */}
      <TimeAllocationInsights data={timeAllocationData} />
    </div>
  );
};
