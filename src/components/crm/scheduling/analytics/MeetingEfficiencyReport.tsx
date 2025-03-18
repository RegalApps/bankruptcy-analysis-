
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
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { MeetingEfficiencyData } from "./hooks/useAnalyticsData";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertTriangle, BarChart3 } from "lucide-react";

interface MeetingEfficiencyReportProps {
  data: MeetingEfficiencyData;
}

export const MeetingEfficiencyReport = ({ data }: MeetingEfficiencyReportProps) => {
  const { monthlyTrends, meetingTypes, preparationStats } = data;

  // Calculate the average efficiency
  const averageEfficiency = meetingTypes.length > 0 
    ? meetingTypes.reduce((sum, item) => sum + item.efficiency, 0) / meetingTypes.length * 100
    : 0;

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
              Meeting Efficiency Analysis
            </CardTitle>
            <CardDescription>
              Tracking duration, completion rates, and optimization opportunities
            </CardDescription>
          </div>
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            {averageEfficiency.toFixed(1)}% Average Efficiency
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trends Chart */}
          <div>
            <h3 className="text-sm font-medium mb-3">Duration & Completion Rate Trends</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyTrends}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[50, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="avgDuration" 
                    stroke="#0ea5e9" 
                    name="Avg Duration (min)"
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="targetDuration" 
                    stroke="#64748b" 
                    strokeDasharray="5 5"
                    name="Target Duration (min)"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="completionRate" 
                    stroke="#22c55e" 
                    name="Completion Rate (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Meeting Types Efficiency */}
          <div>
            <h3 className="text-sm font-medium mb-3">Efficiency by Meeting Type</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={meetingTypes}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avgDuration" name="Avg Duration (min)" fill="#0ea5e9" />
                  <Bar dataKey="targetDuration" name="Target Duration (min)" fill="#64748b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI-generated insights */}
        <div className="mt-6 border-t pt-4">
          <h3 className="text-sm font-medium mb-3">AI-Generated Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Clock className="h-4 w-4 text-blue-500 mr-2" />
                <h4 className="font-medium text-sm">Time Optimization</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Meetings are running {monthlyTrends.length > 0 ? monthlyTrends[monthlyTrends.length - 1].avgDuration - monthlyTrends[monthlyTrends.length - 1].targetDuration : 0}min 
                {monthlyTrends.length > 0 && monthlyTrends[monthlyTrends.length - 1].avgDuration < monthlyTrends[monthlyTrends.length - 1].targetDuration ? ' under' : ' over'} target duration.
                Recent trend shows improvement in meeting efficiency.
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                <h4 className="font-medium text-sm">Preparation Impact</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Meetings with proper preparation are {preparationStats.improvementPercentage}% more efficient.
                Consider implementing standardized prep checklists for all meetings.
              </p>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                <h4 className="font-medium text-sm">Optimization Opportunity</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Initial consultations have the most room for improvement. 
                Consider streamlining intake forms and pre-meeting questionnaires.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
