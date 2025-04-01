
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, FileText, Calendar, DollarSign, MessageSquare } from "lucide-react";
import { ClientInsightData } from "../../activity/hooks/predictiveData/types";
import { format, formatDistanceToNow } from "date-fns";

interface RecentActivitiesCardProps {
  insights: ClientInsightData;
}

export const RecentActivitiesCard = ({ insights }: RecentActivitiesCardProps) => {
  const { recentActivities } = insights;
  
  // Updated to handle any string type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'meeting': return <Calendar className="h-4 w-4 text-green-500" />;
      case 'payment': return <DollarSign className="h-4 w-4 text-purple-500" />;
      case 'communication': return <MessageSquare className="h-4 w-4 text-amber-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />; // Default icon for unknown types
    }
  };
  
  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true });
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{getTimeAgo(activity.timestamp)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p>No recent activities</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
