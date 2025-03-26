
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getPerformanceHistory, getAnomalyThresholds } from "@/utils/performanceMonitor";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AnomalyItem {
  operationName: string;
  currentValue: number;
  threshold: number;
  mean: number;
  stdDev: number;
  history: number[];
}

export const AnomalyDetectionDashboard = () => {
  const [anomalies, setAnomalies] = useState<AnomalyItem[]>([]);
  const [selectedAnomaly, setSelectedAnomaly] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    // Check for anomalies every 5 seconds
    const detectAnomalies = () => {
      const history = getPerformanceHistory();
      const thresholds = getAnomalyThresholds();
      
      const detectedAnomalies: AnomalyItem[] = [];
      
      Object.entries(history).forEach(([operationName, values]) => {
        if (values.length > 0 && thresholds[operationName]) {
          const currentValue = values[values.length - 1];
          const { mean, stdDev } = thresholds[operationName];
          const threshold = mean + (2 * stdDev);
          
          if (currentValue > threshold) {
            detectedAnomalies.push({
              operationName,
              currentValue,
              threshold,
              mean,
              stdDev,
              history: values.slice(-20) // Last 20 values
            });
          }
        }
      });
      
      setAnomalies(detectedAnomalies);
      
      // If we have a selected anomaly, update its chart data
      if (selectedAnomaly && history[selectedAnomaly]) {
        const historyData = history[selectedAnomaly].slice(-50); // Last 50 values
        const chartData = historyData.map((value, index) => ({
          index,
          value,
          mean: thresholds[selectedAnomaly]?.mean || null,
          threshold: thresholds[selectedAnomaly] 
            ? thresholds[selectedAnomaly].mean + (2 * thresholds[selectedAnomaly].stdDev)
            : null
        }));
        
        setChartData(chartData);
      }
    };
    
    detectAnomalies();
    const interval = setInterval(detectAnomalies, 5000);
    
    return () => clearInterval(interval);
  }, [selectedAnomaly]);
  
  const handleSelectAnomaly = (operationName: string) => {
    setSelectedAnomaly(operationName);
    
    const history = getPerformanceHistory(operationName);
    const thresholds = getAnomalyThresholds();
    
    if (history[operationName]) {
      const historyData = history[operationName].slice(-50); // Last 50 values
      const chartData = historyData.map((value, index) => ({
        index,
        value,
        mean: thresholds[operationName]?.mean || null,
        threshold: thresholds[operationName] 
          ? thresholds[operationName].mean + (2 * thresholds[operationName].stdDev)
          : null
      }));
      
      setChartData(chartData);
    }
  };
  
  const acknowledgeAnomaly = (operationName: string) => {
    setAnomalies(prevAnomalies => 
      prevAnomalies.filter(anomaly => anomaly.operationName !== operationName)
    );
    
    if (selectedAnomaly === operationName) {
      setSelectedAnomaly(null);
      setChartData([]);
    }
    
    toast.success(`Anomaly for ${operationName} acknowledged`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Performance Anomaly Detection</h2>
        <Badge variant={anomalies.length > 0 ? "destructive" : "outline"} className="px-3 py-1">
          {anomalies.length} {anomalies.length === 1 ? 'Anomaly' : 'Anomalies'} Detected
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Detected Anomalies</CardTitle>
            <CardDescription>
              Operations that are performing significantly slower than usual
            </CardDescription>
          </CardHeader>
          <CardContent>
            {anomalies.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <p>No anomalies detected</p>
                <p className="text-sm mt-1">All systems performing within expected parameters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {anomalies.map((anomaly) => (
                  <div 
                    key={anomaly.operationName}
                    className={`p-3 rounded-lg border ${
                      selectedAnomaly === anomaly.operationName 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted-foreground/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          <h3 className="font-medium text-sm">{anomaly.operationName}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Current: {anomaly.currentValue.toFixed(0)}ms | Threshold: {anomaly.threshold.toFixed(0)}ms
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {((anomaly.currentValue / anomaly.threshold - 1) * 100).toFixed(0)}% above normal
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleSelectAnomaly(anomaly.operationName)}
                        >
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => acknowledgeAnomaly(anomaly.operationName)}
                        >
                          Acknowledge
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedAnomaly ? `${selectedAnomaly} Performance` : 'Performance Trend'}
            </CardTitle>
            <CardDescription>
              {selectedAnomaly 
                ? 'Detailed view of the selected operation performance over time'
                : 'Select an anomaly to view detailed performance data'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {!selectedAnomaly ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <p>No anomaly selected</p>
                <p className="text-sm mt-1">Select an anomaly from the list to view detailed data</p>
              </div>
            ) : chartData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Loading performance data...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="index" label={{ value: 'Sample', position: 'insideBottomRight', offset: -5 }} />
                  <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    formatter={(value: any) => [`${Number(value).toFixed(2)} ms`, '']}
                    labelFormatter={(label) => `Sample ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    name="Actual Time" 
                    dot={{ r: 1 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mean" 
                    stroke="#82ca9d" 
                    name="Average" 
                    strokeDasharray="5 5"
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="threshold" 
                    stroke="#ff7300" 
                    name="Anomaly Threshold" 
                    strokeDasharray="3 3"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
