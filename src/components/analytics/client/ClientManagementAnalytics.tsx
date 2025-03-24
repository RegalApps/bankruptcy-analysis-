
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { MetricCard } from "@/components/analytics/MetricCard";
import { Users, Clock, TrendingUp, Award } from "lucide-react";
import { useClientManagementData } from "./hooks/useClientManagementData";

export const ClientManagementAnalytics = () => {
  const { 
    clientMetrics,
    casesByStatus,
    clientAcquisitionTrend,
    caseCompletionTimes,
    clientChurnRate,
    satisfactionScores
  } = useClientManagementData();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Active Clients" 
          value={clientMetrics.activeClients.toString()} 
          description="Total active clients in the system" 
          icon={Users}
          trend="up" 
        />
        <MetricCard 
          title="New Clients (MTD)" 
          value={clientMetrics.newClientsMonthly.toString()} 
          description="New clients this month" 
          icon={TrendingUp}
          trend={clientMetrics.newClientsMonthly > clientMetrics.previousMonthNewClients ? "up" : "down"}
        />
        <MetricCard 
          title="Avg. Completion Time" 
          value={`${clientMetrics.avgCompletionDays} days`} 
          description="Average case duration" 
          icon={Clock}
          trend={clientMetrics.avgCompletionDays < clientMetrics.previousAvgCompletionDays ? "up" : "down"}
        />
        <MetricCard 
          title="Client Satisfaction" 
          value={`${clientMetrics.satisfactionScore}/10`} 
          description="Average NPS score" 
          icon={Award}
          trend={clientMetrics.satisfactionScore > 8 ? "up" : clientMetrics.satisfactionScore > 6 ? "neutral" : "down"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Client Acquisition Trends</CardTitle>
            <CardDescription>
              Monthly new client acquisition over the past year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={clientAcquisitionTrend}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="clients"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    name="New Clients"
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#82ca9d"
                    strokeDasharray="5 5"
                    name="Target"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Cases by Status</CardTitle>
            <CardDescription>
              Current distribution of cases across all statuses
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={casesByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {casesByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} cases`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Average Case Completion Time</CardTitle>
            <CardDescription>
              Time to complete cases by type (in days)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={caseCompletionTimes}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} days`, 'Avg. Time']} />
                  <Legend />
                  <Bar dataKey="days" fill="#8884d8" name="Days to Complete" />
                  <Bar dataKey="target" fill="#82ca9d" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Client Satisfaction & Churn</CardTitle>
            <CardDescription>
              NPS scores and churn rates over the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={satisfactionScores}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" domain={[0, 10]} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="nps"
                    stroke="#8884d8"
                    name="NPS Score (0-10)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="churn"
                    stroke="#ff7300"
                    name="Churn Rate (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
