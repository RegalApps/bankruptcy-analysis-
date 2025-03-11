
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuditEntry, ActionType } from "./types";
import { getActionColor } from "./utils";
import { 
  PieChart, Pie, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area
} from "recharts";

interface AuditVisualizationProps {
  entries: AuditEntry[];
}

export const AuditVisualization = ({ entries }: AuditVisualizationProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (!entries.length) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No data available for visualization
      </div>
    );
  }

  // Preparing data for visualizations
  const actionsData = prepareActionsData(entries);
  const timelineData = prepareTimelineData(entries);
  const userActivityData = prepareUserActivityData(entries);
  const securityMetrics = prepareSecurityMetrics(entries);

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-2">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium">Activity by Action Type</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={actionsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {actionsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium">Audit Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 mt-2">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium">Critical Events Distribution</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={securityMetrics.criticalEvents}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#ff4d4f" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium">Security Compliance Score</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex justify-center items-center">
              <div className="relative h-48 w-48">
                {/* Placeholder for a gauge chart - in a real app use a proper gauge component */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-5xl font-bold text-green-600">94%</div>
                </div>
                <div className="absolute bottom-0 w-full text-center text-sm text-muted-foreground">
                  Excellent
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4 mt-2">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium">User Activity by Role</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="role" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="actions" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium">Anomaly Detection</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={securityMetrics.anomalyDetection}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="expected" stroke="#8884d8" />
                    <Line type="monotone" dataKey="actual" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="threshold" stroke="#ff7300" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper functions to prepare data for charts
function prepareActionsData(entries: AuditEntry[]) {
  const actionCounts: Record<ActionType, number> = {} as Record<ActionType, number>;
  
  entries.forEach(entry => {
    actionCounts[entry.action] = (actionCounts[entry.action] || 0) + 1;
  });
  
  return Object.entries(actionCounts).map(([action, count]) => ({
    name: action.replace(/_/g, ' '),
    value: count,
    color: getChartColor(action as ActionType)
  }));
}

function prepareTimelineData(entries: AuditEntry[]) {
  const dateMap: Record<string, number> = {};
  
  entries.forEach(entry => {
    const date = new Date(entry.timestamp).toLocaleDateString();
    dateMap[date] = (dateMap[date] || 0) + 1;
  });
  
  return Object.entries(dateMap).map(([date, count]) => ({
    date,
    count
  }));
}

function prepareUserActivityData(entries: AuditEntry[]) {
  const roleMap: Record<string, number> = {};
  
  entries.forEach(entry => {
    roleMap[entry.user.role] = (roleMap[entry.user.role] || 0) + 1;
  });
  
  return Object.entries(roleMap).map(([role, actions]) => ({
    role,
    actions
  }));
}

function prepareSecurityMetrics(entries: AuditEntry[]) {
  // For demo purposes
  return {
    criticalEvents: [
      { name: 'Delete', value: 5 },
      { name: 'Risk Assessment', value: 8 },
      { name: 'Export', value: 3 },
      { name: 'Signature', value: 2 }
    ],
    anomalyDetection: [
      { date: 'Mon', expected: 40, actual: 38, threshold: 30 },
      { date: 'Tue', expected: 30, actual: 28, threshold: 30 },
      { date: 'Wed', expected: 20, actual: 45, threshold: 30 },
      { date: 'Thu', expected: 25, actual: 24, threshold: 30 },
      { date: 'Fri', expected: 35, actual: 31, threshold: 30 },
      { date: 'Sat', expected: 15, actual: 12, threshold: 30 },
      { date: 'Sun', expected: 10, actual: 8, threshold: 30 }
    ]
  };
}

function getChartColor(action: ActionType) {
  const colorMap: Record<ActionType, string> = {
    upload: '#52c41a',
    edit: '#1890ff',
    delete: '#ff4d4f',
    download: '#722ed1',
    view: '#595959',
    share: '#13c2c2',
    risk_assessment: '#faad14',
    task_assignment: '#2f54eb',
    signature: '#eb2f96',
    export: '#fa8c16'
  };

  return colorMap[action] || '#8884d8';
}

// Define Cell component for the PieChart since it wasn't imported
const Cell = (props: any) => {
  const { fill, children } = props;
  return (
    <g fill={fill}>
      {children}
    </g>
  );
};
