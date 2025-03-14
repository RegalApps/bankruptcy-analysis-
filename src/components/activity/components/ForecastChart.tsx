
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ForecastChartProps {
  processedData: any[] | null;
  categoryAnalysis: Array<{
    name: string;
    value: number;
    percentage: number;
    color: string;
  }> | null;
  isLoading: boolean;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({
  processedData,
  categoryAnalysis,
  isLoading
}) => {
  const [activeTab, setActiveTab] = React.useState("forecast");

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-[350px] w-full" />
      </div>
    );
  }

  if (!processedData || processedData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[350px] border rounded-md">
        <p className="text-muted-foreground">No forecast data available</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('default', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="forecast" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="forecast">6-Month Forecast</TabsTrigger>
          <TabsTrigger value="category">Expense Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="forecast" className="pt-4">
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart
              data={processedData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorSurplus" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="submission_date" 
                tickFormatter={formatDate}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <Tooltip 
                formatter={(value: any) => [`$${value}`, 'Amount']}
                labelFormatter={(label) => formatDate(label)}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="surplus_income" 
                name="Historical Surplus" 
                stroke="#8884d8" 
                fillOpacity={1} 
                fill="url(#colorSurplus)"
                activeDot={{ r: 8 }}
                connectNulls
              />
              <Area 
                type="monotone" 
                dataKey="forecast" 
                name="Forecast" 
                stroke="#82ca9d" 
                fill="#82ca9d"
                fillOpacity={0.3}
                strokeDasharray="5 5"
                connectNulls
              />
            </AreaChart>
          </ResponsiveContainer>
        </TabsContent>
        
        <TabsContent value="category" className="pt-4">
          {categoryAnalysis && categoryAnalysis.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Expense Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={categoryAnalysis}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryAnalysis.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Category Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryAnalysis.map((category, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{category.name}</span>
                          <span className="text-sm">${category.value.toFixed(2)} ({category.percentage}%)</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${category.percentage}%`,
                              backgroundColor: category.color
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[250px] border rounded-md">
              <p className="text-muted-foreground">No category data available</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
