
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { TrusteeWorkloadData } from "./hooks/useAnalyticsData";
import { Badge } from "@/components/ui/badge";
import { Users, AlertTriangle, Check } from "lucide-react";

interface TrusteeWorkloadDistributionProps {
  data: TrusteeWorkloadData;
}

export const TrusteeWorkloadDistribution = ({ data }: TrusteeWorkloadDistributionProps) => {
  const { distribution, imbalanceScore, recommendations } = data;
  
  // Color logic for capacity bars
  const getBarColor = (capacity: number) => {
    if (capacity > 0.95) return "#ef4444"; // Red for overcapacity
    if (capacity > 0.85) return "#f59e0b"; // Amber for high load
    return "#22c55e"; // Green for good load
  };
  
  // Function to get badge variant based on priority
  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Low</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Users className="h-5 w-5 mr-2 text-purple-500" />
          Trustee Workload Distribution
        </CardTitle>
        <CardDescription>
          Analyzing staff capacity and balance optimization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={distribution}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis label={{ value: 'Capacity %', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value: number) => [`${(value * 100).toFixed(0)}%`, 'Capacity']}
              />
              <Bar dataKey="capacity" name="Capacity Utilization">
                {distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.capacity)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="p-3 bg-purple-50 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-purple-600 mr-2" />
            <span className="text-sm font-medium">Workload Imbalance Score</span>
          </div>
          <span className="text-lg font-bold">
            {(imbalanceScore * 100).toFixed(0)}%
          </span>
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">AI Workload Recommendations</h4>
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start space-x-2 p-2 border-l-2 border-purple-200 bg-white rounded-sm pl-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{rec.description}</p>
                    {getPriorityBadge(rec.priority)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{rec.impact}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
