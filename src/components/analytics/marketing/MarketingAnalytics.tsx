
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
import { Users, Megaphone, TrendingUp, Award } from "lucide-react";

// Mock data for marketing analytics
const leadSourceData = [
  { name: 'Referrals', value: 145 },
  { name: 'Website', value: 98 },
  { name: 'Partners', value: 67 },
  { name: 'Social Media', value: 43 },
  { name: 'Other', value: 12 }
];

const conversionTrendData = [
  { month: 'Jul', leads: 52, conversions: 18, rate: 34.6 },
  { month: 'Aug', leads: 58, conversions: 21, rate: 36.2 },
  { month: 'Sep', leads: 62, conversions: 23, rate: 37.1 },
  { month: 'Oct', leads: 69, conversions: 26, rate: 37.7 },
  { month: 'Nov', leads: 74, conversions: 29, rate: 39.2 },
  { month: 'Dec', leads: 79, conversions: 32, rate: 40.5 }
];

const websiteEngagementData = [
  { date: 'Week 1', visitors: 385, pageViews: 1247, formSubmissions: 28 },
  { date: 'Week 2', visitors: 402, pageViews: 1322, formSubmissions: 32 },
  { date: 'Week 3', visitors: 421, pageViews: 1408, formSubmissions: 35 },
  { date: 'Week 4', visitors: 438, pageViews: 1476, formSubmissions: 39 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const MarketingAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Leads (MTD)" 
          value="79" 
          description="New potential clients this month" 
          icon={Users}
          trend="up" 
        />
        <MetricCard 
          title="Conversion Rate" 
          value="40.5%" 
          description="Lead to client conversion" 
          icon={TrendingUp}
          trend="up"
        />
        <MetricCard 
          title="Referral Rate" 
          value="32%" 
          description="Leads from client referrals" 
          icon={Megaphone}
          trend="neutral"
        />
        <MetricCard 
          title="Client Acquisition Cost" 
          value="$210" 
          description="Average cost per new client" 
          icon={Award}
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
            <CardDescription>
              Where new potential clients are coming from
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadSourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {leadSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} leads`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Conversion Trends</CardTitle>
            <CardDescription>
              Lead conversion rate over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={conversionTrendData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="leads"
                    stroke="#8884d8"
                    name="Total Leads"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="conversions"
                    stroke="#82ca9d"
                    name="Conversions"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="rate"
                    stroke="#ff7300"
                    name="Conversion Rate (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Website Engagement</CardTitle>
          <CardDescription>
            Website activity over the past month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={websiteEngagementData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="visitors" fill="#8884d8" name="Unique Visitors" />
                <Bar yAxisId="left" dataKey="pageViews" fill="#82ca9d" name="Page Views" />
                <Bar yAxisId="right" dataKey="formSubmissions" fill="#ff7300" name="Form Submissions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
