
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CrmMetricsGrid } from "./CrmMetricsGrid";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line, AreaChart, Area, Legend
} from "recharts";

interface Props {
  leadConversion?: Array<{ name: string; value: number }>;
  featureUsage?: Array<{ name: string; value: number }>;
  salesRepRevenue?: Array<{ name: string; revenue: number }>;
  churnRate?: Array<{ date: string; rate: number }>;
  customerAcquisitionCost?: Array<{ period: string; cost: number }>;
  monthlyRevenue?: Array<{ date: string; revenue: number; projected: number }>;
  salesCycle?: Array<{ date: string; days: number }>;
  npsScore?: Array<{ period: string; score: number }>;
}

const COLORS = {
  success: ['#0EA5E9', '#33C3F0', '#D3E4FD'],
  warning: ['#F97316', '#ea384c', '#FEC6A1'],
  neutral: ['#9b87f5', '#7E69AB', '#66B2B2']
};

// Default mock data to prevent undefined map errors
const defaultData = {
  leadConversion: [
    { name: "Leads", value: 120 },
    { name: "MQLs", value: 80 },
    { name: "SQLs", value: 40 },
    { name: "Opportunities", value: 20 },
    { name: "Customers", value: 10 }
  ],
  featureUsage: [
    { name: "Analytics", value: 35 },
    { name: "Document Management", value: 25 },
    { name: "Collaboration", value: 20 },
    { name: "Automation", value: 15 },
    { name: "Reporting", value: 5 }
  ],
  salesRepRevenue: [
    { name: "John", revenue: 15000 },
    { name: "Sarah", revenue: 12000 },
    { name: "Mike", revenue: 10000 },
    { name: "Lisa", revenue: 9000 },
    { name: "David", revenue: 7500 }
  ],
  churnRate: [
    { date: "Jan", rate: 5.2 },
    { date: "Feb", rate: 4.8 },
    { date: "Mar", rate: 5.1 },
    { date: "Apr", rate: 4.5 },
    { date: "May", rate: 4.2 },
    { date: "Jun", rate: 3.8 }
  ],
  customerAcquisitionCost: [
    { period: "Q1 2024", cost: 1200 },
    { period: "Q2 2024", cost: 1150 },
    { period: "Q3 2024", cost: 1100 },
    { period: "Q4 2024", cost: 950 }
  ],
  monthlyRevenue: [
    { date: "Jan", revenue: 25000, projected: 24000 },
    { date: "Feb", revenue: 27000, projected: 26000 },
    { date: "Mar", revenue: 28500, projected: 28000 },
    { date: "Apr", revenue: 30000, projected: 29000 },
    { date: "May", revenue: 31500, projected: 30000 },
    { date: "Jun", revenue: 33000, projected: 32000 }
  ],
  salesCycle: [
    { date: "Q1", days: 45 },
    { date: "Q2", days: 42 },
    { date: "Q3", days: 40 },
    { date: "Q4", days: 38 }
  ],
  npsScore: [
    { period: "Jan", score: 65 },
    { period: "Feb", score: 68 },
    { period: "Mar", score: 70 },
    { period: "Apr", score: 72 },
    { period: "May", score: 75 },
    { period: "Jun", score: 77 }
  ]
};

export const CrmAnalytics = ({
  leadConversion = defaultData.leadConversion,
  featureUsage = defaultData.featureUsage,
  salesRepRevenue = defaultData.salesRepRevenue,
  churnRate = defaultData.churnRate,
  customerAcquisitionCost = defaultData.customerAcquisitionCost,
  monthlyRevenue = defaultData.monthlyRevenue,
  salesCycle = defaultData.salesCycle,
  npsScore = defaultData.npsScore
}: Props) => {
  return (
    <div className="space-y-6">
      <CrmMetricsGrid />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lead Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadConversion} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="value" fill={COLORS.success[0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Sales Rep */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Sales Rep</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesRepRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill={COLORS.success[1]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Customer Churn Rate */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Churn Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={churnRate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke={COLORS.warning[1]} 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Customer Acquisition Cost */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Acquisition Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customerAcquisitionCost}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cost" fill={COLORS.warning[0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Recurring Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Recurring Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={COLORS.success[0]}
                    fill={COLORS.success[2]}
                    name="Actual Revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="projected"
                    stroke={COLORS.neutral[0]}
                    fill={COLORS.neutral[2]}
                    name="Projected Revenue"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Feature Usage Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Usage Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={featureUsage}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {featureUsage.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS.neutral[index % COLORS.neutral.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
