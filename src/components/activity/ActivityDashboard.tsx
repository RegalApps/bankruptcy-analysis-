
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const ActivityDashboard = () => {
  const { data: financialRecords, isLoading } = useQuery({
    queryKey: ["financial_records"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_records")
        .select("*")
        .order("submission_date", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Income vs Expenses Overview</CardTitle>
          <CardDescription>Monthly financial trends analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p>Loading financial data...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={financialRecords}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="submission_date"
                    tickFormatter={(date) =>
                      new Date(date).toLocaleDateString()
                    }
                  />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="monthlyIncome"
                    stroke="#8884d8"
                    name="Income"
                  />
                  <Line
                    type="monotone"
                    dataKey="totalExpenses"
                    stroke="#82ca9d"
                    name="Expenses"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
