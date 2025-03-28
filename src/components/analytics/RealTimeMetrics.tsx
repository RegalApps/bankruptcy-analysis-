
import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Activity, BarChart2, Clock, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const RealTimeMetrics = () => {
  const analytics = useAnalytics();
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalEvents: 0,
    pageViews: 0,
    uniquePages: 0,
    interactions: 0,
    sessionDuration: 0,
  });
  const [pageViewData, setPageViewData] = useState<Array<{name: string, views: number}>>([]);
  
  // Update metrics every 5 seconds
  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(analytics.getMetrics());
      setPageViewData(analytics.getPageViewData());
      setIsLoading(false);
    };
    
    // Initial update with a short delay to ensure analytics is initialized
    const initialTimer = setTimeout(updateMetrics, 300);
    
    // Set up interval for updates
    const intervalId = setInterval(updateMetrics, 5000);
    
    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalId);
    };
  }, [analytics]);
  
  // Memoize formatted duration to prevent recalculations
  const formattedDuration = useMemo(() => {
    const seconds = metrics.sessionDuration;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  }, [metrics.sessionDuration]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <Skeleton className="h-32 w-full rounded-md" />
            <Skeleton className="h-32 w-full rounded-md" />
            <Skeleton className="h-32 w-full rounded-md" />
            <Skeleton className="h-32 w-full rounded-md" />
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.pageViews}</div>
                <p className="text-xs text-muted-foreground">
                  Across {metrics.uniquePages} unique pages
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User Interactions</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.interactions}</div>
                <p className="text-xs text-muted-foreground">
                  Total user actions tracked
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Session Duration</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formattedDuration}</div>
                <p className="text-xs text-muted-foreground">
                  Current session time
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalEvents}</div>
                <p className="text-xs text-muted-foreground">
                  All tracked activities
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-80 w-full rounded-md" />
            <Skeleton className="h-80 w-full rounded-md" />
          </>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Page View Distribution</CardTitle>
                <CardDescription>Most visited pages in current session</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {pageViewData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={pageViewData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="views" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No page view data available yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Real-Time Activity</CardTitle>
                <CardDescription>Current session analytics data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {pageViewData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pageViewData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="views"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {pageViewData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No activity data available yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
