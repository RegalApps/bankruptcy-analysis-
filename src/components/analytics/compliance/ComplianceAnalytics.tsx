
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
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { MetricCard } from "@/components/analytics/MetricCard";
import { Shield, AlertTriangle, FileText, Activity } from "lucide-react";
import { useComplianceData } from "./hooks/useComplianceData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const ComplianceAnalytics = () => {
  const { 
    complianceMetrics,
    complianceRateHistory,
    riskDistribution,
    auditData,
    complianceBreaches,
    riskTrends
  } = useComplianceData();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Compliance Rate" 
          value={`${complianceMetrics.complianceRate}%`} 
          description="Forms meeting requirements" 
          icon={Shield}
          trend={complianceMetrics.complianceRate > 95 ? "up" : complianceMetrics.complianceRate > 85 ? "neutral" : "down"} 
        />
        <MetricCard 
          title="High Risk Cases" 
          value={complianceMetrics.highRiskCases.toString()} 
          description="Cases requiring attention" 
          icon={AlertTriangle}
          trend={complianceMetrics.highRiskCases < complianceMetrics.previousHighRiskCases ? "up" : "down"}
        />
        <MetricCard 
          title="Audits Completed" 
          value={complianceMetrics.auditsCompleted.toString()} 
          description="Internal audits this quarter" 
          icon={FileText}
          trend={complianceMetrics.auditsCompleted >= complianceMetrics.auditTarget ? "up" : "neutral"}
        />
        <MetricCard 
          title="Avg. Resolution Time" 
          value={`${complianceMetrics.avgResolutionDays} days`} 
          description="Days to fix compliance issues" 
          icon={Activity}
          trend={complianceMetrics.avgResolutionDays < complianceMetrics.previousResolutionDays ? "up" : "down"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Compliance Rate Trend</CardTitle>
            <CardDescription>
              Monthly compliance rate over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={complianceRateHistory}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[75, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    name="Compliance Rate (%)"
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#82ca9d"
                    strokeDasharray="5 5"
                    name="Target (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Case Risk Distribution</CardTitle>
            <CardDescription>
              Current risk level assessment across all cases
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {riskDistribution.map((entry, index) => (
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
            <CardTitle>Compliance Breaches by Category</CardTitle>
            <CardDescription>
              Monthly breach incidents by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={complianceBreaches}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="documentation" stackId="1" stroke="#8884d8" fill="#8884d8" name="Documentation" />
                  <Area type="monotone" dataKey="deadlines" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Deadlines" />
                  <Area type="monotone" dataKey="financials" stackId="1" stroke="#ffc658" fill="#ffc658" name="Financial Reporting" />
                  <Area type="monotone" dataKey="other" stackId="1" stroke="#ff8042" fill="#ff8042" name="Other" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Audit Results</CardTitle>
            <CardDescription>
              Internal audits and identified issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Audit Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Issues Found</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditData.map((audit, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{audit.date}</TableCell>
                    <TableCell>{audit.type}</TableCell>
                    <TableCell>{audit.issuesFound}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        audit.status === 'Completed' 
                          ? 'bg-green-100 text-green-800' 
                          : audit.status === 'In Progress' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {audit.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Risk Level Trends</CardTitle>
          <CardDescription>
            Changes in risk profile over the last 12 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={riskTrends}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="high" stackId="a" fill="#ff8042" name="High Risk" />
                <Bar dataKey="medium" stackId="a" fill="#ffc658" name="Medium Risk" />
                <Bar dataKey="low" stackId="a" fill="#82ca9d" name="Low Risk" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
