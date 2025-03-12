
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ForecastChartProps {
  processedData: any[];
  categoryAnalysis?: Array<{
    name: string;
    value: number;
    percentage: number;
    color: string;
  }>;
  isLoading: boolean;
}

export const ForecastChart = ({ processedData, categoryAnalysis, isLoading }: ForecastChartProps) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a569bd', '#3498db', '#e74c3c'];
  const RADIAN = Math.PI / 180;
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Forecast & Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="forecast" className="space-y-4">
          <TabsList>
            <TabsTrigger value="forecast">6-Month Projection</TabsTrigger>
            <TabsTrigger value="categories">Expense Categories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="forecast">
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
          </TabsContent>
          
          <TabsContent value="categories">
            <div className="h-[400px]">
              {!categoryAnalysis || categoryAnalysis.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p>No category analysis data available</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                  <div className="flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryAnalysis}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryAnalysis.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Expense Breakdown</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Distribution of monthly expenses by category
                    </p>
                    <div className="space-y-2">
                      {categoryAnalysis.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: item.color || COLORS[index % COLORS.length] }}
                            ></div>
                            <span>{item.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${item.value.toFixed(2)}</div>
                            <div className="text-xs text-muted-foreground">{item.percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
