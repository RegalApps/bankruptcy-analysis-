
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { getPerformanceMeasurements, getAnomalyThresholds } from '@/utils/performanceMonitor';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface AnomalyData {
  name: string;
  value: number;
  threshold: number;
  isAnomaly: boolean;
}

interface ThresholdData {
  name: string;
  mean: number;
  upperBound: number;
  lowerBound: number;
}

export const AnomalyDetectionDashboard = () => {
  const [anomalyData, setAnomalyData] = useState<AnomalyData[]>([]);
  const [thresholdData, setThresholdData] = useState<ThresholdData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Format performance data for charts
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const measurements = getPerformanceMeasurements();
        const thresholds = getAnomalyThresholds();
        
        const formattedAnomalyData = Object.entries(measurements).map(([key, value]) => {
          const threshold = thresholds[key] || { mean: 0, stdDev: 0 };
          const thresholdValue = threshold.mean + (2 * threshold.stdDev);
          
          return {
            name: key.replace(/-/g, ' ').replace(/^./, str => str.toUpperCase()),
            value: Math.round(value as number),
            threshold: Math.round(thresholdValue),
            isAnomaly: threshold.mean > 0 && (value as number) > thresholdValue
          };
        });
        
        const formattedThresholdData = Object.entries(thresholds).map(([key, threshold]) => ({
          name: key.replace(/-/g, ' ').replace(/^./, str => str.toUpperCase()),
          mean: Math.round(threshold.mean),
          upperBound: Math.round(threshold.mean + (2 * threshold.stdDev)),
          lowerBound: Math.round(Math.max(0, threshold.mean - (2 * threshold.stdDev)))
        }));
        
        setAnomalyData(formattedAnomalyData);
        setThresholdData(formattedThresholdData);
      } catch (error) {
        console.error('Error loading performance data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    
    // Set up an interval to refresh the data every 30 seconds
    const interval = setInterval(loadData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Filter only anomalies for the anomalies chart
  const anomaliesOnly = useMemo(() => 
    anomalyData.filter(item => item.isAnomaly), 
    [anomalyData]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="medium" />
        <p className="ml-3">Loading performance metrics...</p>
      </div>
    );
  }

  // If no anomalies detected, show a message
  if (anomaliesOnly.length === 0 && anomalyData.length > 0) {
    return (
      <div className="py-8 text-center">
        <h3 className="text-lg font-medium text-green-600">No performance anomalies detected!</h3>
        <p className="text-muted-foreground mt-2">All systems are running within expected parameters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {anomaliesOnly.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detected Performance Anomalies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={300}>
                <BarChart data={anomaliesOnly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'value') return [`${value}ms`, 'Actual'];
                      if (name === 'threshold') return [`${value}ms`, 'Threshold'];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar dataKey="threshold" name="Expected Threshold" fill="#8884d8" opacity={0.5} />
                  <Bar dataKey="value" name="Actual Time (ms)" fill="#ff6b6b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Performance Thresholds</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={300}>
              <BarChart data={thresholdData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value}ms`, 'Time']}
                />
                <Legend />
                <Bar dataKey="mean" name="Average (ms)" fill="#82ca9d" />
                <Bar dataKey="upperBound" name="Upper Threshold (ms)" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
