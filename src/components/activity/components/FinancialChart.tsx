
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FinancialChartProps {
  chartData: Array<{
    date: string;
    Income: number;
    Expenses: number;
    Surplus: number;
  }>;
  expenseBreakdown: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  clientName: string;
}

export const FinancialChart: React.FC<FinancialChartProps> = ({ 
  chartData,
  expenseBreakdown,
  clientName
}) => {
  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
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

  // Calculate expense total for percentages
  const expenseTotal = expenseBreakdown.reduce((sum, item) => sum + item.value, 0);
  const expenseBreakdownWithPercentage = expenseBreakdown.map(item => ({
    ...item,
    percentage: expenseTotal > 0 ? (item.value / expenseTotal) * 100 : 0
  }));

  return (
    <Tabs defaultValue="monthly">
      <TabsList className="mb-4">
        <TabsTrigger value="monthly">Monthly Trends</TabsTrigger>
        <TabsTrigger value="breakdown">Expense Breakdown</TabsTrigger>
      </TabsList>

      <TabsContent value="monthly" className="h-[400px]">
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No financial data available for {clientName}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, '']} />
              <Legend />
              <Line type="monotone" dataKey="Income" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Expenses" stroke="#82ca9d" />
              <Line type="monotone" dataKey="Surplus" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </TabsContent>

      <TabsContent value="breakdown" className="h-[400px]">
        {expenseBreakdown.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No expense data available for {clientName}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 h-full">
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={expenseBreakdownWithPercentage}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseBreakdownWithPercentage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value}`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 flex flex-col justify-center">
              <h3 className="text-lg font-medium">Expense Distribution</h3>
              <div className="space-y-2">
                {expenseBreakdownWithPercentage.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
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
      </TabsContent>
    </Tabs>
  );
};
