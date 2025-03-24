
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { MetricCard } from "@/components/analytics/MetricCard";
import { Users, Activity, Download, BarChart2 } from "lucide-react";

// Mock data
const usageData = [
  { day: 'Mon', users: 42, sessions: 78, duration: 36 },
  { day: 'Tue', users: 48, sessions: 92, duration: 40 },
  { day: 'Wed', users: 51, sessions: 102, duration: 38 },
  { day: 'Thu', users: 47, sessions: 89, duration: 42 },
  { day: 'Fri', users: 44, sessions: 85, duration: 39 }
];

const featureUsageData = [
  { name: 'Document Management', value: 35 },
  { name: 'Client Profiles', value: 25 },
  { name: 'Form Filing', value: 18 },
  { name: 'Analytics', value: 12 },
  { name: 'Calendar', value: 10 }
];

const issueReportingData = [
  { week: 'Week 1', critical: 2, major: 5, minor: 8, resolved: 12 },
  { week: 'Week 2', critical: 1, major: 4, minor: 7, resolved: 10 },
  { week: 'Week 3', critical: 0, major: 3, minor: 5, resolved: 7 },
  { week: 'Week 4', critical: 1, major: 2, minor: 4, resolved: 6 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const SystemUsageAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Daily Active Users" 
          value="48" 
          description="Average users per day" 
          icon={Users}
          trend="up" 
        />
        <MetricCard 
          title="Session Duration" 
          value="39 min" 
          description="Average time per session" 
          icon={Activity}
          trend="neutral"
        />
        <MetricCard 
          title="Downloads" 
          value="184" 
          description="Documents downloaded this week" 
          icon={Download}
          trend="up"
        />
        <MetricCard 
          title="Feature Adoption" 
          value="87%" 
          description="Core features regularly used" 
          icon={BarChart2}
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Platform Usage Patterns</CardTitle>
            <CardDescription>
              Daily user activity and session metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={usageData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 60]} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="users" fill="#8884d8" name="Unique Users" />
                  <Bar yAxisId="left" dataKey="sessions" fill="#82ca9d" name="Total Sessions" />
                  <Line yAxisId="right" type="monotone" dataKey="duration" stroke="#ff7300" name="Avg Duration (min)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Feature Usage Distribution</CardTitle>
            <CardDescription>
              Most utilized system features
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={featureUsageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {featureUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>User Feedback & Issue Tracking</CardTitle>
          <CardDescription>
            Reported issues by severity level and resolution rate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={issueReportingData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="critical" stackId="1" stroke="#ff0000" fill="#ff0000" name="Critical Issues" />
                <Area type="monotone" dataKey="major" stackId="1" stroke="#ffc658" fill="#ffc658" name="Major Issues" />
                <Area type="monotone" dataKey="minor" stackId="1" stroke="#8884d8" fill="#8884d8" name="Minor Issues" />
                <Area type="monotone" dataKey="resolved" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Resolved Issues" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
