import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { MetricCard } from "@/components/analytics/MetricCard";
import { Users, ClipboardCheck, Clock, BarChart2 } from "lucide-react";
import { useOperationalData } from "./hooks/useOperationalData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const OperationalEfficiencyAnalytics = () => {
  const { 
    operationalMetrics,
    staffProductivityData,
    taskCompletionData,
    processingTimeData,
    workflowBottlenecks
  } = useOperationalData();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Avg. Cases Per Staff" 
          value={operationalMetrics.avgCasesPerStaff.toString()} 
          description="Cases managed per employee" 
          icon={Users}
          trend={operationalMetrics.avgCasesPerStaff > operationalMetrics.targetCasesPerStaff ? "up" : "neutral"} 
        />
        <MetricCard 
          title="Task Completion Rate" 
          value={`${operationalMetrics.taskCompletionRate}%`} 
          description="Tasks completed on time" 
          icon={ClipboardCheck}
          trend={operationalMetrics.taskCompletionRate > 90 ? "up" : operationalMetrics.taskCompletionRate > 75 ? "neutral" : "down"}
        />
        <MetricCard 
          title="Avg. Response Time" 
          value={`${operationalMetrics.avgResponseHours}h`} 
          description="Hours to respond to clients" 
          icon={Clock}
          trend={operationalMetrics.avgResponseHours < 24 ? "up" : operationalMetrics.avgResponseHours < 48 ? "neutral" : "down"}
        />
        <MetricCard 
          title="Process Efficiency" 
          value={`${operationalMetrics.processEfficiency}%`} 
          description="Overall workflow efficiency" 
          icon={BarChart2}
          trend={operationalMetrics.processEfficiency > operationalMetrics.previousEfficiency ? "up" : "down"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Staff Productivity</CardTitle>
            <CardDescription>
              Cases handled per staff member across departments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={staffProductivityData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="activeCases" fill="#8884d8" name="Active Cases" />
                  <Bar dataKey="completedCases" fill="#82ca9d" name="Completed (Last 30d)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Task Management Performance</CardTitle>
            <CardDescription>
              Task completion rates and response times
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={taskCompletionData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 72]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="completionRate"
                    stroke="#8884d8"
                    name="Completion Rate (%)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="responseTime"
                    stroke="#ff7300"
                    name="Avg Response Time (hrs)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Process Turnaround Times</CardTitle>
            <CardDescription>
              Average time to complete key processes (in days)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={processingTimeData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="process" />
                  <PolarRadiusAxis angle={30} domain={[0, 40]} />
                  <Radar
                    name="Current"
                    dataKey="current"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Target"
                    dataKey="target"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.6}
                  />
                  <Legend />
                  <Tooltip formatter={(value) => [`${value} days`, '']} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Workflow Bottlenecks</CardTitle>
            <CardDescription>
              Stages with highest delays in process flow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Process Stage</TableHead>
                  <TableHead>Avg. Delay (days)</TableHead>
                  <TableHead>Impact Level</TableHead>
                  <TableHead>Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workflowBottlenecks.map((bottleneck, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{bottleneck.stage}</TableCell>
                    <TableCell>{bottleneck.delay}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        bottleneck.impact === 'High' 
                          ? 'bg-red-100 text-red-800' 
                          : bottleneck.impact === 'Medium' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {bottleneck.impact}
                      </span>
                    </TableCell>
                    <TableCell>{bottleneck.trend}</TableCell>
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
