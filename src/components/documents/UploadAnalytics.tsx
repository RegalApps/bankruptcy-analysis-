
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getUploadAnalytics, getUploadSpeedTrend } from '@/utils/documents/uploadTracker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowDown, ArrowUp, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface AnalyticsState {
  totalUploads: number;
  successRate: number;
  averageDuration: number;
  byFileType: Record<string, { count: number, successCount: number, averageDuration: number }>;
  recent: Array<{
    documentId: string;
    timestamp: number;
    duration: number;
    fileType: string;
    fileSize: number;
    success: boolean;
    errorMessage?: string;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const UploadAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsState>({
    totalUploads: 0,
    successRate: 0,
    averageDuration: 0,
    byFileType: {},
    recent: []
  });
  const [speedTrend, setSpeedTrend] = useState<Array<{ count: number, totalSize: number, timestamp: number }>>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Get current analytics data
    const data = getUploadAnalytics();
    setAnalytics(data);
    
    // Get speed trend data
    const trend = getUploadSpeedTrend();
    setSpeedTrend(trend);
    
    // Set up periodic refresh
    const intervalId = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [refreshKey]);
  
  // Format file sizes for display
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  // Format duration for display
  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms} ms`;
    return `${(ms / 1000).toFixed(1)} s`;
  };
  
  // Prepare data for file type chart
  const fileTypeData = Object.entries(analytics.byFileType).map(([type, data]) => ({
    name: type,
    value: data.count
  }));
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Analytics Dashboard</CardTitle>
          <CardDescription>
            Performance metrics and upload statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Total Uploads Card */}
            <div className="bg-card rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Total Uploads</h3>
                <span className="text-2xl font-bold">{analytics.totalUploads}</span>
              </div>
            </div>
            
            {/* Success Rate Card */}
            <div className="bg-card rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Success Rate</h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{(analytics.successRate * 100).toFixed(1)}%</span>
                  {analytics.successRate >= 0.95 ? (
                    <ArrowUp className="h-4 w-4 text-green-500" />
                  ) : analytics.successRate < 0.8 ? (
                    <ArrowDown className="h-4 w-4 text-red-500" />
                  ) : null}
                </div>
              </div>
              <Progress value={analytics.successRate * 100} className="mt-2" />
            </div>
            
            {/* Avg Duration Card */}
            <div className="bg-card rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Avg Processing Time</h3>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">{formatDuration(analytics.averageDuration)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File Types Chart */}
            <div className="bg-card rounded-lg shadow-sm border p-4">
              <h3 className="text-sm font-medium mb-4">Uploads by File Type</h3>
              {fileTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={fileTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {fileTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} uploads`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted-foreground py-10">No data available</p>
              )}
            </div>
            
            {/* Upload Speed Trend */}
            <div className="bg-card rounded-lg shadow-sm border p-4">
              <h3 className="text-sm font-medium mb-4">Upload Volume (24h)</h3>
              {speedTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={speedTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={(timestamp) => {
                        const date = new Date(timestamp);
                        return `${date.getHours()}:00`;
                      }} 
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'totalSize') return [formatFileSize(Number(value)), 'Total Size'];
                        return [value, 'Count'];
                      }}
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                      }}
                    />
                    <Bar dataKey="count" name="Uploads" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted-foreground py-10">No data available</p>
              )}
            </div>
          </div>
          
          {/* Recent Uploads */}
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-4">Recent Uploads</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left p-2">File Type</th>
                    <th className="text-left p-2">Size</th>
                    <th className="text-left p-2">Duration</th>
                    <th className="text-right p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recent.length > 0 ? (
                    analytics.recent.map((upload, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                        <td className="p-2">
                          {upload.fileType}
                        </td>
                        <td className="p-2">{formatFileSize(upload.fileSize)}</td>
                        <td className="p-2">{formatDuration(upload.duration)}</td>
                        <td className="p-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {upload.success ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <span className="text-xs text-green-500">Success</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-red-500" />
                                <span 
                                  className="text-xs text-red-500 truncate max-w-32"
                                  title={upload.errorMessage}
                                >
                                  Failed
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-muted-foreground">
                        No recent uploads available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
