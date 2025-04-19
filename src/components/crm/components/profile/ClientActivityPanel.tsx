
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientInsightData } from "../../../activity/hooks/predictiveData/types";
import { Activity, FileText, MessageSquare, Calendar, Phone, Mail, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ClientActivityPanelProps {
  insights: ClientInsightData;
}

export const ClientActivityPanel = ({ insights }: ClientActivityPanelProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4 text-blue-500" />;
      case 'call': return <Phone className="h-4 w-4 text-green-500" />;
      case 'meeting': return <Calendar className="h-4 w-4 text-purple-500" />;
      case 'note': return <FileText className="h-4 w-4 text-amber-500" />;
      case 'message': return <MessageSquare className="h-4 w-4 text-indigo-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Get time ago string from timestamp
  const getTimeAgo = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  // Check if there's a significant time gap in activity
  const getTimeGapAlerts = () => {
    const sortedActivities = [...insights.recentActivities].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    if (sortedActivities.length > 0) {
      const lastActivity = new Date(sortedActivities[0].timestamp);
      const daysSinceLastActivity = Math.floor((Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceLastActivity > 14) {
        return (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Activity Gap Detected</AlertTitle>
            <AlertDescription>
              No client interaction in {daysSinceLastActivity} days. Consider scheduling a follow-up.
            </AlertDescription>
          </Alert>
        );
      }
    }
    
    return null;
  };

  return (
    <div className="h-full p-4 overflow-hidden flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Client Activity & Timeline</h2>
      
      {getTimeGapAlerts()}

      {insights.aiSuggestions.filter(s => s.type === 'info').length > 0 && (
        <div className="mb-4">
          {insights.aiSuggestions
            .filter(s => s.type === 'info')
            .map((suggestion, index) => (
              <Alert key={index} className="mb-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{suggestion.message}</AlertDescription>
              </Alert>
            ))}
        </div>
      )}
      
      <Tabs defaultValue="activity" className="flex-1 overflow-hidden flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activity">Activity Feed</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="notes">Notes & Files</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity" className="flex-1 overflow-auto mt-4">
          <div className="space-y-4">
            {insights.recentActivities.length > 0 ? (
              insights.recentActivities.map((activity) => (
                <div key={activity.id} className="flex gap-3 p-3 border rounded-md">
                  <div className="mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {getTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No activity recorded yet</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="timeline" className="flex-1 overflow-auto mt-4">
          <div className="relative pl-6 border-l-2 border-muted">
            {insights.recentActivities.length > 0 ? (
              insights.recentActivities.map((activity, index) => (
                <div key={activity.id} className="mb-6 relative">
                  <div className="absolute -left-[17px] p-1 bg-background rounded-full border border-muted">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {getTimeAgo(activity.timestamp)}
                    </p>
                    
                    {/* Show gap in timeline if more than 7 days between activities */}
                    {index < insights.recentActivities.length - 1 && 
                      (new Date(activity.timestamp).getTime() - 
                      new Date(insights.recentActivities[index + 1].timestamp).getTime()) > 7 * 24 * 60 * 60 * 1000 && (
                      <div className="mt-2 mb-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
                        7+ day gap in communication
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>No timeline data available</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="notes" className="flex-1 overflow-auto mt-4">
          <div className="space-y-4">
            {insights.clientNotes?.length > 0 ? (
              insights.clientNotes.map((note, index) => (
                <div key={index} className="p-3 border rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium">{note.title}</h4>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(note.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm">{note.content}</p>
                  {note.attachments && note.attachments.length > 0 && (
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-xs font-medium mb-1">Attachments:</p>
                      <div className="flex flex-wrap gap-2">
                        {note.attachments.map((attachment, i) => (
                          <div key={i} className="flex items-center gap-1 text-xs text-blue-600">
                            <FileText className="h-3 w-3" />
                            <span>{attachment}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No notes or files yet</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
