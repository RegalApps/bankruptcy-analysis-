
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const MeetingsAnalytics = () => {
  // Mock data for meetings analytics
  const meetingData = {
    totalMeetings: 128,
    completionRate: 92,
    averageDuration: 42,
    clientSatisfaction: 4.7,
    meetingTypes: [
      { type: "Initial Consultation", count: 45, percentage: 35 },
      { type: "Follow-up", count: 38, percentage: 30 },
      { type: "Document Review", count: 25, percentage: 20 },
      { type: "Final Sign-off", count: 20, percentage: 15 }
    ],
    monthlyTrends: [
      { month: "Jan", meetings: 18, satisfaction: 4.5 },
      { month: "Feb", meetings: 22, satisfaction: 4.6 },
      { month: "Mar", meetings: 20, satisfaction: 4.6 },
      { month: "Apr", meetings: 25, satisfaction: 4.7 },
      { month: "May", meetings: 23, satisfaction: 4.8 },
      { month: "Jun", meetings: 20, satisfaction: 4.7 }
    ]
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Meeting Analytics</h2>
        <p className="text-muted-foreground">
          Comprehensive analysis of meeting performance and client feedback metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meetingData.totalMeetings}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meetingData.completionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">+2.5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meetingData.averageDuration} min</div>
            <p className="text-xs text-muted-foreground mt-1">-3 min from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Client Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meetingData.clientSatisfaction}/5</div>
            <p className="text-xs text-muted-foreground mt-1">Based on post-meeting reviews</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Meeting Distribution by Type</CardTitle>
            <CardDescription>Breakdown of meetings by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {meetingData.meetingTypes.map((type) => (
                <div key={type.type} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{type.type}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${type.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">{type.count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meeting Feedback Analysis</CardTitle>
            <CardDescription>Key insights from client reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Most Appreciated Aspects</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Clear explanation of insolvency processes (92%)</li>
                  <li>Trustee knowledge and professionalism (89%)</li>
                  <li>Empathetic approach to client situations (84%)</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Areas for Improvement</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Meeting follow-up communication (76% satisfaction)</li>
                  <li>Technical platform experience (82% satisfaction)</li>
                  <li>Meeting duration optimization (78% satisfaction)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
