
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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { ClientEngagementData } from "./hooks/useAnalyticsData";
import { Trophy, TrendingUp, Lightbulb } from "lucide-react";

interface ClientEngagementScoresProps {
  data: ClientEngagementData;
}

export const ClientEngagementScores = ({ data }: ClientEngagementScoresProps) => {
  const { overallScore, byClientType, trendData, factors } = data;
  
  // Colors for the client type pie chart
  const COLORS = ['#0ea5e9', '#f97316', '#8b5cf6', '#22c55e'];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-amber-500" />
          Client Engagement Scores
        </CardTitle>
        <CardDescription>
          Measuring client participation and satisfaction metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-amber-500">{overallScore}</div>
            <div className="text-sm text-muted-foreground">Overall Score</div>
            <div className="flex items-center justify-center mt-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2.4% from last quarter
            </div>
          </div>
        </div>
        
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trendData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[80, 95]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="Engagement Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center">
            <Lightbulb className="h-4 w-4 text-amber-500 mr-2" />
            <h4 className="text-sm font-medium">AI-Generated Recommendations</h4>
          </div>
          <ul className="space-y-2 mt-2">
            {factors.map((factor, index) => (
              <li key={index} className="text-sm border-l-2 border-amber-200 pl-3 py-1">
                <span className="font-medium">{factor.factor}:</span> {factor.recommendation}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
