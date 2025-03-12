
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

interface FinancialChartProps {
  chartData: Array<{
    date: string;
    Income: number;
    Expenses: number;
    Surplus: number;
  }>;
  expenseBreakdown?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  clientName: string;
}

export const FinancialChart = ({ chartData, expenseBreakdown, clientName }: FinancialChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
        <CardDescription>Monthly financial trends for {clientName}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList>
            <TabsTrigger value="trends">Income vs Expenses</TabsTrigger>
            <TabsTrigger value="breakdown">Expense Breakdown</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trends">
            <div className="h-[400px]">
              {chartData.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p>No financial data available for this client</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, undefined]} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="Income"
                      stroke="#8884d8"
                      name="Income"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="Expenses"
                      stroke="#82ca9d"
                      name="Expenses" 
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="Surplus"
                      stroke="#ff7300"
                      name="Surplus"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="breakdown">
            <div className="h-[400px]">
              {!expenseBreakdown || expenseBreakdown.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p>No expense breakdown data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={expenseBreakdown} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                    <Bar dataKey="value" fill="#8884d8">
                      {expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
