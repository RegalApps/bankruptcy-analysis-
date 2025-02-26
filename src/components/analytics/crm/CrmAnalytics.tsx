
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CrmMetricsGrid } from "./CrmMetricsGrid";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line, AreaChart, Area, Legend
} from "recharts";

interface Props {
  leadConversion: Array<{ name: string; value: number }>;
  featureUsage: Array<{ name: string; value: number }>;
  salesRepRevenue: Array<{ name: string; revenue: number }>;
  churnRate: Array<{ date: string; rate: number }>;
  customerAcquisitionCost: Array<{ period: string; cost: number }>;
  monthlyRevenue: Array<{ date: string; revenue: number; projected: number }>;
  salesCycle: Array<{ date: string; days: number }>;
  npsScore: Array<{ period: string; score: number }>;
}

const COLORS = {
  success: ['#0EA5E9', '#33C3F0', '#D3E4FD'],
  warning: ['#F97316', '#ea384c', '#FEC6A1'],
  neutral: ['#9b87f5', '#7E69AB', '#66B2B2']
};

export const CrmAnalytics = ({
  leadConversion,
  featureUsage,
  salesRepRevenue,
  churnRate,
  customerAcquisitionCost,
  monthlyRevenue,
  salesCycle,
  npsScore
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
