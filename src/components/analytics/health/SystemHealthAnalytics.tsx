
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
  ResponsiveContainer 
} from "recharts";
import { MetricCard } from "@/components/analytics/MetricCard";
import { Activity, Clock, Shield, Bell } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data
const uptimeData = [
  { day: 'Mon', uptime: 99.98 },
  { day: 'Tue', uptime: 100.00 },
  { day: 'Wed', uptime: 99.99 },
  { day: 'Thu', uptime: 99.95 },
  { day: 'Fri', uptime: 100.00 },
  { day: 'Sat', uptime: 100.00 },
  { day: 'Sun', uptime: 99.97 }
];

const responseTimeData = [
  { time: '8:00', api: 87, database: 45, total: 132 },
  { time: '10:00', api: 92, database: 48, total: 140 },
  { time: '12:00', api: 108, database: 52, total: 160 },
  { time: '14:00', api: 102, database: 50, total: 152 },
  { time: '16:00', api: 95, database: 47, total: 142 },
  { time: '18:00', api: 90, database: 46, total: 136 }
];

const supportTicketsData = [
  { week: 'Week 1', critical: 2, high: 5, medium: 12, low: 8 },
  { week: 'Week 2', critical: 1, high: 4, medium: 10, low: 9 },
  { week: 'Week 3', critical: 0, high: 3, medium: 8, low: 7 },
  { week: 'Week 4', critical: 0, high: 2, medium: 7, low: 6 }
];

const recentAlertsData = [
  { time: '2023-12-15 08:32', severity: 'Low', message: 'Database connection pool reached 80% capacity', status: 'Resolved' },
  { time: '2023-12-14 14:21', severity: 'Medium', message: 'API response time exceeded threshold', status: 'Resolved' },
  { time: '2023-12-13 10:15', severity: 'Low', message: 'Scheduled maintenance upcoming', status: 'Acknowledged' },
  { time: '2023-12-12 16:42', severity: 'High', message: 'File storage reaching capacity limit', status: 'In Progress' },
  { time: '2023-12-10 09:18', severity: 'Low', message: 'Minor UI rendering issue in reports section', status: 'Resolved' }
];

export const SystemHealthAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="System Uptime" 
          value="99.98%" 
          description="Last 30 days availability" 
          icon={Activity}
          trend="up" 
        />
        <MetricCard 
          title="Avg Response Time" 
          value="142ms" 
          description="Application response time" 
          icon={Clock}
          trend="up"
        />
        <MetricCard 
          title="Security Status" 
          value="Secure" 
          description="All systems protected" 
          icon={Shield}
          trend="up"
        />
        <MetricCard 
          title="Active Alerts" 
          value="1" 
          description="System warnings requiring attention" 
          icon={Bell}
          trend="neutral"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>System Uptime</CardTitle>
            <CardDescription>
              Daily system availability percentage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={uptimeData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[99.8, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Uptime']} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="uptime"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    name="Uptime Percentage"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Response Time Breakdown</CardTitle>
            <CardDescription>
              System response times throughout the day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={responseTimeData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}ms`, '']} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="api" 
                    stackId="1"
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    name="API Response Time" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="database" 
                    stackId="1"
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    name="Database Response Time" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#ff7300" 
                    name="Total Response Time" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Support Tickets</CardTitle>
            <CardDescription>
              Weekly support ticket volume by severity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={supportTicketsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="critical" stackId="a" fill="#ff0000" name="Critical" />
                  <Bar dataKey="high" stackId="a" fill="#ff8042" name="High" />
                  <Bar dataKey="medium" stackId="a" fill="#ffc658" name="Medium" />
                  <Bar dataKey="low" stackId="a" fill="#82ca9d" name="Low" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent System Alerts</CardTitle>
            <CardDescription>
              Latest notifications and warnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAlertsData.map((alert, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{alert.time}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        alert.severity === 'Low' 
                          ? 'bg-green-100 text-green-800' 
                          : alert.severity === 'Medium' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {alert.severity}
                      </span>
                    </TableCell>
                    <TableCell>{alert.message}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        alert.status === 'Resolved' 
                          ? 'bg-green-100 text-green-800' 
                          : alert.status === 'In Progress' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {alert.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
