
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
  ComposedChart,
  Area
} from "recharts";
import { MetricCard } from "@/components/analytics/MetricCard";
import { Map, TrendingUp, AlertTriangle, Activity } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data
const regionDistributionData = [
  { region: 'Ontario', clients: 185, cases: 210, growth: 8.2 },
  { region: 'British Columbia', clients: 124, cases: 142, growth: 6.5 },
  { region: 'Alberta', clients: 98, cases: 113, growth: 4.2 },
  { region: 'Quebec', clients: 78, cases: 92, growth: 9.3 },
  { region: 'Atlantic', clients: 43, cases: 51, growth: 7.8 },
  { region: 'Other', clients: 24, cases: 29, growth: 5.4 }
];

const regionalRiskData = [
  { region: 'Ontario', highRisk: 8, mediumRisk: 37, lowRisk: 165 },
  { region: 'British Columbia', highRisk: 5, mediumRisk: 28, lowRisk: 109 },
  { region: 'Alberta', highRisk: 4, mediumRisk: 22, lowRisk: 87 },
  { region: 'Quebec', highRisk: 6, mediumRisk: 20, lowRisk: 66 },
  { region: 'Atlantic', highRisk: 2, mediumRisk: 12, lowRisk: 37 }
];

const regionalTrendData = [
  { month: 'Jan', ontario: 172, bc: 118, alberta: 94, quebec: 72 },
  { month: 'Feb', ontario: 175, bc: 120, alberta: 95, quebec: 73 },
  { month: 'Mar', ontario: 178, bc: 121, alberta: 96, quebec: 74 },
  { month: 'Apr', ontario: 180, bc: 122, alberta: 97, quebec: 75 },
  { month: 'May', ontario: 182, bc: 123, alberta: 97, quebec: 76 },
  { month: 'Jun', ontario: 185, bc: 124, alberta: 98, quebec: 78 }
];

const regionalComplianceData = [
  { region: 'Ontario', complianceRate: 94.2, riskLevel: 'Low', keyIssue: 'Document Delays' },
  { region: 'British Columbia', complianceRate: 92.8, riskLevel: 'Low', keyIssue: 'Income Verification' },
  { region: 'Alberta', complianceRate: 93.5, riskLevel: 'Low', keyIssue: 'Asset Disclosure' },
  { region: 'Quebec', complianceRate: 91.7, riskLevel: 'Medium', keyIssue: 'Provincial Regulations' },
  { region: 'Atlantic', complianceRate: 95.2, riskLevel: 'Low', keyIssue: 'Filing Timing' },
  { region: 'Manitoba/Sask', complianceRate: 94.8, riskLevel: 'Low', keyIssue: 'Documentation Quality' },
  { region: 'Territories', complianceRate: 90.5, riskLevel: 'Medium', keyIssue: 'Jurisdiction Issues' }
];

export const GeographicAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Top Region" 
          value="Ontario" 
          description="Highest client concentration" 
          icon={Map}
          trend="neutral" 
        />
        <MetricCard 
          title="Fastest Growing" 
          value="Quebec" 
          description="9.3% growth in last quarter" 
          icon={TrendingUp}
          trend="up"
        />
        <MetricCard 
          title="Highest Risk Region" 
          value="Quebec" 
          description="6.5% high-risk cases" 
          icon={AlertTriangle}
          trend="down"
        />
        <MetricCard 
          title="Most Compliant" 
          value="Atlantic" 
          description="95.2% compliance rate" 
          icon={Activity}
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Case Distribution by Region</CardTitle>
            <CardDescription>
              Client and case distribution across regions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={regionDistributionData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 12]} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="clients" fill="#8884d8" name="Active Clients" />
                  <Bar yAxisId="left" dataKey="cases" fill="#82ca9d" name="Active Cases" />
                  <Line yAxisId="right" type="monotone" dataKey="growth" stroke="#ff7300" name="Growth Rate (%)" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Regional Risk Distribution</CardTitle>
            <CardDescription>
              Risk profile across geographic regions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={regionalRiskData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  stackOffset="expand"
                  layout="vertical"
                  barSize={30}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 'dataMax']} />
                  <YAxis dataKey="region" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="highRisk" stackId="a" fill="#ff8042" name="High Risk" />
                  <Bar dataKey="mediumRisk" stackId="a" fill="#ffbb28" name="Medium Risk" />
                  <Bar dataKey="lowRisk" stackId="a" fill="#00c49f" name="Low Risk" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Regional Case Trends</CardTitle>
            <CardDescription>
              Client growth patterns by region
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={regionalTrendData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="ontario" stroke="#8884d8" name="Ontario" />
                  <Line type="monotone" dataKey="bc" stroke="#82ca9d" name="British Columbia" />
                  <Line type="monotone" dataKey="alberta" stroke="#ffc658" name="Alberta" />
                  <Line type="monotone" dataKey="quebec" stroke="#ff8042" name="Quebec" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Regional Compliance Analysis</CardTitle>
            <CardDescription>
              Compliance rates and key issues by region
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Region</TableHead>
                  <TableHead>Compliance Rate</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Key Issue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regionalComplianceData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.region}</TableCell>
                    <TableCell>{item.complianceRate}%</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.riskLevel === 'Low' 
                          ? 'bg-green-100 text-green-800' 
                          : item.riskLevel === 'Medium' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.riskLevel}
                      </span>
                    </TableCell>
                    <TableCell>{item.keyIssue}</TableCell>
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
