
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { ClientInsightData } from "../../activity/hooks/predictiveData/types";

interface UpcomingDeadlinesCardProps {
  insights: ClientInsightData;
}

export const UpcomingDeadlinesCard = ({ insights }: UpcomingDeadlinesCardProps) => {
  const { upcomingDeadlines } = insights;
  
  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
    }
  };
  
  const getDaysRemaining = (dateString: string) => {
    const today = new Date();
    const deadline = new Date(dateString);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Upcoming Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingDeadlines.length > 0 ? (
            upcomingDeadlines.map((deadline) => {
              const daysRemaining = getDaysRemaining(deadline.date);
              
              return (
                <div key={deadline.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <p className="font-medium text-sm">{deadline.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">{deadline.date}</p>
                      <Badge variant="outline" className={getPriorityColor(deadline.priority)}>
                        {deadline.priority}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${
                      daysRemaining <= 2 ? 'text-red-600' : 
                      daysRemaining <= 5 ? 'text-amber-600' : 
                      'text-green-600'
                    }`}>
                      {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
                    </p>
                    <p className="text-xs text-muted-foreground">remaining</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p>No upcoming deadlines</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
