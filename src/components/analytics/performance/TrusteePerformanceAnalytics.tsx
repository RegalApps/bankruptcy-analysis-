
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
  Radar,
  ScatterChart,
  Scatter,
  ZAxis
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MetricCard } from "@/components/analytics/MetricCard";
import { Users, Award, FileText, Clock } from "lucide-react";

// Mock data for trustee performance
const caseLoadData = [
  { name: 'John Smith', activeCases: 32, capacity: 35, utilization: 91 },
  { name: 'Maria Garcia', activeCases: 28, capacity: 30, utilization: 93 },
  { name: 'David Chen', activeCases: 35, capacity: 35, utilization: 100 },
  { name: 'Sarah Johnson', activeCases: 22, capacity: 30, utilization: 73 },
  { name: 'Michael Taylor', activeCases: 34, capacity: 35, utilization: 97 },
  { name: 'Angela Williams', activeCases: 29, capacity: 30, utilization: 97 }
];

const performanceRatingsData = [
  { quarter: 'Q1', clientSatisfaction: 4.2, efficiencyScore: 85, complianceRate: 92 },
  { quarter: 'Q2', clientSatisfaction: 4.3, efficiencyScore: 87, complianceRate: 94 },
  { quarter: 'Q3', clientSatisfaction: 4.4, efficiencyScore: 90, complianceRate: 95 },
  { quarter: 'Q4', clientSatisfaction: 4.6, efficiencyScore: 92, complianceRate: 97 }
];

const trainingData = [
  { name: 'Regulatory Updates', completion: 94, impact: 4.2 },
  { name: 'Client Communication', completion: 87, impact: 4.5 },
  { name: 'Document Management', completion: 92, impact: 4.0 },
  { name: 'Ethics Training', completion: 100, impact: 4.7 },
  { name: 'Financial Assessment', completion: 89, impact: 4.3 }
];

const performanceDistributionData = [
  { name: 'John S.', caseCompletion: 21, clientSatisfaction: 4.7, caseLoad: 32 },
  { name: 'Maria G.', caseCompletion: 19, clientSatisfaction: 4.6, caseLoad: 28 },
  { name: 'David C.', caseCompletion: 24, clientSatisfaction: 4.2, caseLoad: 35 },
  { name: 'Sarah J.', caseCompletion: 18, clientSatisfaction: 4.8, caseLoad: 22 },
  { name: 'Michael T.', caseCompletion: 22, clientSatisfaction: 4.5, caseLoad: 34 },
  { name: 'Angela W.', caseCompletion: 20, clientSatisfaction: 4.6, caseLoad: 29 }
];

const trusteeSkillsData = [
  {
    subject: 'Client Communication',
    A: 90,
    B: 85,
    fullMark: 100,
  },
  {
    subject: 'Document Management',
    A: 95,
    B: 90,
    fullMark: 100,
  },
  {
    subject: 'Compliance',
    A: 92,
    B: 88,
    fullMark: 100,
  },
  {
    subject: 'Financial Assessment',
    A: 88,
    B: 82,
    fullMark: 100,
  },
  {
    subject: 'Time Management',
    A: 86,
    B: 90,
    fullMark: 100,
  },
  {
    subject: 'Technical Skills',
    A: 89,
    B: 91,
    fullMark: 100,
  },
];

export const TrusteePerformanceAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Average Caseload" 
          value="30" 
          description="Cases per trustee" 
          icon={Users}
          trend="neutral" 
        />
        <MetricCard 
          title="Average Rating" 
          value="4.6/5" 
          description="Trustee performance rating" 
          icon={Award}
          trend="up"
        />
        <MetricCard 
          title="Training Completion" 
          value="92%" 
          description="Required training completed" 
          icon={FileText}
          trend="up"
        />
        <MetricCard 
          title="Case Completion Time" 
          value="20 days" 
          description="Average processing time" 
          icon={Clock}
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Trustee Caseload Distribution</CardTitle>
            <CardDescription>
              Current active cases per trustee vs. capacity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={caseLoadData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="activeCases" fill="#8884d8" name="Active Cases" />
                  <Bar yAxisId="left" dataKey="capacity" fill="#82ca9d" name="Capacity" />
                  <Line yAxisId="right" type="monotone" dataKey="utilization" stroke="#ff7300" name="Utilization (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Performance Ratings Over Time</CardTitle>
            <CardDescription>
              Key performance indicators by quarter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={performanceRatingsData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis yAxisId="left" orientation="left" domain={[3.5, 5]} />
                  <YAxis yAxisId="right" orientation="right" domain={[70, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="clientSatisfaction"
                    stroke="#8884d8"
                    name="Client Satisfaction (1-5)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="efficiencyScore"
                    stroke="#82ca9d"
                    name="Efficiency Score (%)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="complianceRate"
                    stroke="#ff7300"
                    name="Compliance Rate (%)"
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
            <CardTitle>Training & Development</CardTitle>
            <CardDescription>
              Completion rates and performance impact by training type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={trainingData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completion" fill="#8884d8" name="Completion Rate (%)" />
                  <Bar dataKey="impact" fill="#82ca9d" name="Performance Impact (1-5)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Trustee Skill Analysis</CardTitle>
            <CardDescription>
              Comparison of skills across trustee groups
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={trusteeSkillsData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Experienced Trustees"
                    dataKey="A"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="New Trustees"
                    dataKey="B"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.6}
                  />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Performance Distribution</CardTitle>
          <CardDescription>
            Relationship between case load, completion time, and client satisfaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid />
                <XAxis type="number" dataKey="caseCompletion" name="Case Completion Time (days)" />
                <YAxis type="number" dataKey="clientSatisfaction" name="Client Satisfaction (1-5)" domain={[3.5, 5]} />
                <ZAxis type="number" dataKey="caseLoad" range={[60, 400]} name="Case Load" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value, name) => {
                  if (name === 'caseCompletion') return [`${value} days`, 'Avg. Completion Time'];
                  if (name === 'clientSatisfaction') return [`${value}/5`, 'Client Satisfaction'];
                  if (name === 'caseLoad') return [`${value} cases`, 'Total Case Load'];
                  return [value, name];
                }} />
                <Legend />
                <Scatter name="Trustees" data={performanceDistributionData} fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
