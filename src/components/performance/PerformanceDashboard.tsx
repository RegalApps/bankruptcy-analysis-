
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { startTiming, endTiming } from "@/utils/performanceMonitor";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: Date;
}

export const PerformanceDashboard = () => {
  const [pageLoadMetrics, setPageLoadMetrics] = useState<PerformanceMetric[]>([]);
  const [resourceMetrics, setResourceMetrics] = useState<PerformanceMetric[]>([]);
  const [interactionMetrics, setInteractionMetrics] = useState<PerformanceMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    startTiming("performance-dashboard-load");
    
    // In a real app, these would come from your monitoring backend
    const fetchPerformanceData = () => {
      // This is mock data - in production, fetch from an API
      setPageLoadMetrics([
        { name: "Home", value: 320, timestamp: new Date(Date.now() - 86400000) },
        { name: "Documents", value: 450, timestamp: new Date(Date.now() - 86400000 * 0.9) },
        { name: "Analytics", value: 520, timestamp: new Date(Date.now() - 86400000 * 0.8) },
        { name: "Activity", value: 400, timestamp: new Date(Date.now() - 86400000 * 0.7) },
        { name: "CRM", value: 480, timestamp: new Date(Date.now() - 86400000 * 0.6) },
        { name: "Settings", value: 300, timestamp: new Date(Date.now() - 86400000 * 0.5) },
        { name: "E-Filing", value: 390, timestamp: new Date(Date.now() - 86400000 * 0.4) },
      ]);

      setResourceMetrics([
        { name: "CSS", value: 120, timestamp: new Date(Date.now() - 86400000) },
        { name: "JS", value: 780, timestamp: new Date(Date.now() - 86400000) },
        { name: "Images", value: 390, timestamp: new Date(Date.now() - 86400000) },
        { name: "Fonts", value: 210, timestamp: new Date(Date.now() - 86400000) },
        { name: "API Calls", value: 520, timestamp: new Date(Date.now() - 86400000) },
      ]);

      setInteractionMetrics([
        { name: "First Input Delay", value: 18, timestamp: new Date(Date.now() - 86400000) },
        { name: "Time to Interactive", value: 620, timestamp: new Date(Date.now() - 86400000) },
        { name: "First Contentful Paint", value: 350, timestamp: new Date(Date.now() - 86400000) },
      ]);

      setIsLoading(false);
    };

    // Simulate network request
    setTimeout(() => {
      fetchPerformanceData();
      endTiming("performance-dashboard-load");
    }, 800);
  }, []);

  const downloadReport = () => {
    toast({
      title: "Report Downloaded",
      description: "Performance report has been downloaded successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Performance Dashboard</h2>
        <Button onClick={downloadReport} className="flex items-center gap-2">
          <Download size={16} />
          Download Report
        </Button>
      </div>

      <Tabs defaultValue="page-load">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="page-load">Page Load Performance</TabsTrigger>
          <TabsTrigger value="resources">Resource Utilization</TabsTrigger>
          <TabsTrigger value="interaction">User Interaction</TabsTrigger>
        </TabsList>

        <TabsContent value="page-load" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Load Times (ms)</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading performance metrics...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pageLoadMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}ms`, 'Load Time']} />
                    <Legend />
                    <Bar dataKey="value" name="Load Time (ms)" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Resource Size (KB)</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading resource metrics...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={resourceMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}KB`, 'Size']} />
                    <Legend />
                    <Bar dataKey="value" name="Size (KB)" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interaction" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Interaction Metrics (ms)</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading interaction metrics...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={interactionMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}ms`, 'Time']} />
                    <Legend />
                    <Bar dataKey="value" name="Time (ms)" fill="#ff7300" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
