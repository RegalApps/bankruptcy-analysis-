
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FinancialChartProps {
  chartData: Array<{
    date: string;
    Income: number;
    Expenses: number;
    Surplus: number;
  }>;
  clientName: string;
}

export const FinancialChart = ({ chartData, clientName }: FinancialChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expenses Overview</CardTitle>
        <CardDescription>Monthly financial trends for {clientName}</CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};
