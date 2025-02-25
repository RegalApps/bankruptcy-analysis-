
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ForecastChartProps {
  processedData: any[];
  isLoading: boolean;
}

export const ForecastChart = ({ processedData, isLoading }: ForecastChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Surplus Income Forecast (6-Month Projection)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p>Loading forecast data...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="submission_date"
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(label) => new Date(label).toLocaleDateString()}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "Amount"]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="surplus_income"
                  stroke="#8884d8"
                  name="Actual Surplus"
                  dot={(props: any) => {
                    if (processedData[props.index]?.isForecast) return null;
                    const isAnomaly = processedData[props.index]?.isAnomaly;
                    return isAnomaly ? (
                      <circle
                        cx={props.cx}
                        cy={props.cy}
                        r={6}
                        fill="red"
                        stroke="none"
                      />
                    ) : (
                      <circle
                        cx={props.cx}
                        cy={props.cy}
                        r={4}
                        fill={props.fill}
                        stroke="none"
                      />
                    );
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#82ca9d"
                  name="Forecast"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
