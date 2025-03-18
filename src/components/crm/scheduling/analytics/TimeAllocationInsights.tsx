
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
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { TimeAllocationData } from "./hooks/useAnalyticsData";
import { Clock, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface TimeAllocationInsightsProps {
  data: TimeAllocationData;
}

export const TimeAllocationInsights = ({ data }: TimeAllocationInsightsProps) => {
  const { byActivity, trends, recommendations } = data;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Clock className="h-5 w-5 mr-2 text-green-500" />
          Time Allocation Insights
        </CardTitle>
        <CardDescription>
          Analyzing time distribution and optimization opportunities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Distribution Pie Chart */}
          <div>
            <h3 className="text-sm font-medium mb-3">Time Distribution by Activity</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byActivity}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {byActivity.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value}%`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Time Allocation Trends */}
          <div>
            <h3 className="text-sm font-medium mb-3">Allocation Trends (6 Month)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trends}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="clientMeetings" 
                    stackId="1"
                    stroke="#0ea5e9" 
                    fill="#0ea5e9" 
                    name="Client Meetings"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="documentation" 
                    stackId="1"
                    stroke="#f97316" 
                    fill="#f97316" 
                    name="Documentation"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="adminTasks" 
                    stackId="1"
                    stroke="#8b5cf6" 
                    fill="#8b5cf6" 
                    name="Admin Tasks"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="otherActivities" 
                    stackId="1"
                    stroke="#64748b" 
                    fill="#64748b" 
                    name="Other"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Recommendations */}
          <div>
            <h3 className="text-sm font-medium mb-3">AI Optimization Recommendations</h3>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{rec.area}</span>
                    <span className="text-xs text-muted-foreground">
                      {rec.current}% <ArrowRight className="inline h-3 w-3 mx-1" /> {rec.recommended}%
                    </span>
                  </div>
                  <Progress value={rec.current} max={100} className="h-2" />
                  <p className="text-xs text-muted-foreground">{rec.potentialImpact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
